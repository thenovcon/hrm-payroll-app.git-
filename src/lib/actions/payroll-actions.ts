'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { TAX_BRACKETS } from '@/lib/payroll/taxRates';

// --- STATUTORY CALCULATION HELPERS ---

/**
 * Calculates Ghana PAYE tax based on 2024 graduated tax bands.
 * @param taxableIncome Gross Income - SSNIT (5.5%)
 */
export async function calculateGhanaPAYE(taxableIncome: number): Promise<number> {
    let tax = 0;
    let remaining = taxableIncome;

    for (const bracket of TAX_BRACKETS) {
        if (remaining <= 0) break;
        const amountInBracket = Math.min(remaining, bracket.limit);
        tax += amountInBracket * bracket.rate;
        remaining -= amountInBracket;
    }

    return parseFloat(tax.toFixed(2));
}



// --- PAYROLL ACTIONS ---

export async function getPayrollSettings() {
    try {
        let settings = await prisma.payrollSettings.findUnique({
            where: { id: 'GLOBAL' },
            include: { taxBrackets: true }
        });

        if (!settings) {
            // Seed default Ghana settings if missing
            settings = await prisma.payrollSettings.create({
                data: {
                    id: 'GLOBAL',
                    ssnitEmployeeRate: 5.5,
                    ssnitEmployerRate: 13.0,
                    tier2EmployeeRate: 5.0,
                    tier2EmployerRate: 5.0,
                    tier3Enabled: false,
                    tier3EmployeeRate: 0,
                    tier3EmployerRate: 0
                },
                include: { taxBrackets: true }
            });
        }
        return { success: true, data: settings };
    } catch (error) {
        return { success: false, error: 'Failed to fetch payroll settings' };
    }
}

export async function updatePayrollSettings(data: {
    ssnitEmployeeRate?: number;
    ssnitEmployerRate?: number;
    tier3Enabled?: boolean;
    tier3EmployeeRate?: number;
    tier3EmployerRate?: number;
}) {
    try {
        const settings = await prisma.payrollSettings.update({
            where: { id: 'GLOBAL' },
            data: data
        });
        revalidatePath('/settings');
        revalidatePath('/payroll');
        return { success: true, data: settings };
    } catch (error) {
        return { success: false, error: 'Failed to update payroll settings' };
    }
}

export async function getPayrollRuns() {
    try {
        const runs = await prisma.payrollRun.findMany({
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            include: { payslips: true }
        });
        return { success: true, data: runs };
    } catch (error) {
        return { success: false, error: 'Failed to fetch payroll runs' };
    }
}

export async function createPayrollRun(month: number, year: number) {
    try {
        // 1. Check if run already exists
        const existing = await prisma.payrollRun.findUnique({
            where: { month_year: { month, year } }
        });
        if (existing) return { success: false, error: 'Payroll run already exists for this period' };

        // 2. Get all active employees with salary structures
        const employees = await prisma.employee.findMany({
            where: { status: 'ACTIVE' },
            include: {
                salaryStructure: true,
                deductions: { where: { status: 'ACTIVE' } },
                payrollInputs: {
                    where: { month, year }
                }
            }
        });

        // 3. Create the run
        const run = await prisma.payrollRun.create({
            data: { month, year, status: 'DRAFT' }
        });

        const settings = (await getPayrollSettings()).data;
        const ssnitRate = settings?.ssnitEmployeeRate || 5.5;
        const ssnitEmployerRate = settings?.ssnitEmployerRate || 13.0;

        // Tier 3 Config
        const tier3Enabled = settings?.tier3Enabled || false;
        const tier3Rate = settings?.tier3EmployeeRate || 0;
        const tier3EmployerRate = settings?.tier3EmployerRate || 0;

        let totalRunNetPay = 0;
        let totalRunCost = 0;

        // 4. Generate payslips
        for (const emp of employees) {
            if (!emp.salaryStructure) continue;

            const basicSalary = emp.salaryStructure.basicSalary;

            // Sum allowances from JSON if present
            let allowancesAmount = 0;
            if (emp.salaryStructure.allowances) {
                const allowances = JSON.parse(emp.salaryStructure.allowances);
                allowancesAmount = allowances.reduce((sum: number, a: any) => sum + (parseFloat(a.amount) || 0), 0);
            }

            // Sum monthly inputs (Bonuses, etc.)
            const inputsAmount = emp.payrollInputs.reduce((sum: number, input: any) => sum + input.amount, 0);

            const grossSalary = basicSalary + allowancesAmount + inputsAmount;

            // Statutory Deductions (Tier 1 & 2)
            const ssnitEmployee = parseFloat((basicSalary * (ssnitRate / 100)).toFixed(2));
            const ssnitEmployer = parseFloat((basicSalary * (ssnitEmployerRate / 100)).toFixed(2));

            // Tier 3 (Provident Fund) - Calculated on Basic
            let tier3Employee = 0;
            let tier3Employer = 0;

            if (tier3Enabled) {
                tier3Employee = parseFloat((basicSalary * (tier3Rate / 100)).toFixed(2));
                tier3Employer = parseFloat((basicSalary * (tier3EmployerRate / 100)).toFixed(2));
            }

            // Taxable Income = Gross - (SSNIT Employee + Tier 3 Employee)
            // Note: Tier 3 is tax exempt up to 16.5% of basic salary fully.
            // Assumption: The configured rate is within the tax-exempt limit.
            const totalTaxExempt = ssnitEmployee + tier3Employee;
            const taxableIncome = Math.max(0, grossSalary - totalTaxExempt);

            const incomeTax = await calculateGhanaPAYE(taxableIncome);

            // Other Deductions (Loans, etc.)
            const otherDeductions = emp.deductions.reduce((sum: number, d: any) => sum + d.monthlyAmount, 0);

            const totalDeductions = ssnitEmployee + tier3Employee + incomeTax + otherDeductions;
            const netPay = grossSalary - totalDeductions;

            await prisma.payslip.create({
                data: {
                    payrollRunId: run.id,
                    employeeId: emp.id,
                    basicSalary,
                    totalAllowances: allowancesAmount + inputsAmount,
                    grossSalary,
                    taxableIncome,
                    incomeTax,
                    ssnitEmployee,
                    ssnitEmployer,
                    tier2Employee: 0,
                    tier2Employer: 0,
                    tier3Employee,
                    tier3Employer,
                    totalDeductions,
                    netPay
                }
            });

            // Update deduction balances if this was a final run (but we are in DRAFT, so we'll do it on LOCK)
            totalRunNetPay += netPay;
            totalRunCost += (grossSalary + ssnitEmployer + tier3Employer);
        }

        // 5. Update run totals
        await prisma.payrollRun.update({
            where: { id: run.id },
            data: { totalNetPay: totalRunNetPay, totalCost: totalRunCost }
        });

        revalidatePath('/payroll');
        return { success: true, data: run };
    } catch (error) {
        console.error('Payroll Run Error:', error);
        return { success: false, error: 'Failed to process payroll run' };
    }
}

export async function updatePayrollStatus(id: string, status: string) {
    try {
        const run = await prisma.payrollRun.update({
            where: { id },
            data: { status }
        });

        // If status is APPROVED or PAID, we could trigger deduction balance updates here
        if (status === 'PAID') {
            const payslips = await prisma.payslip.findMany({
                where: { payrollRunId: id },
                include: { employee: { include: { deductions: { where: { status: 'ACTIVE' } } } } }
            });

            for (const slip of payslips) {
                for (const d of slip.employee.deductions) {
                    const newBalance = Math.max(0, d.remainingBalance - d.monthlyAmount);
                    await prisma.deduction.update({
                        where: { id: d.id },
                        data: {
                            remainingBalance: newBalance,
                            status: newBalance <= 0 ? 'COMPLETED' : 'ACTIVE'
                        }
                    });
                }
            }
        }

        revalidatePath('/payroll');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function exportBankDisbursement(runId: string) {
    try {
        const payslips = await prisma.payslip.findMany({
            where: { payrollRunId: runId },
            include: {
                employee: {
                    include: { bankDetails: true }
                }
            }
        });

        // Generate CSV content
        let csv = 'Employee ID,Name,Bank Name,Branch,Account Number,Amount (GHS),Mobile Money Number,Network\n';
        payslips.forEach(slip => {
            const emp = slip.employee;
            const bank = emp.bankDetails;
            csv += `${emp.employeeId},${emp.firstName} ${emp.lastName},${bank?.bankName || ''},${bank?.branchName || ''},${bank?.accountNumber || ''},${slip.netPay},${bank?.mobileMoneyNumber || ''},${bank?.mobileMoneyNetwork || ''}\n`;
        });

        return { success: true, data: csv };
    } catch (error) {
        return { success: false, error: 'Failed to generate bank file' };
    }
}

export async function generateComplianceData(runId: string) {
    try {
        const payslips = await prisma.payslip.findMany({
            where: { payrollRunId: runId }
        });

        const graTotal = payslips.reduce((acc, slip) => ({
            taxableIncome: acc.taxableIncome + slip.taxableIncome,
            incomeTax: acc.incomeTax + slip.incomeTax,
        }), { taxableIncome: 0, incomeTax: 0 });

        const ssnitTotal = payslips.reduce((acc, slip) => ({
            ssnitEmployee: acc.ssnitEmployee + slip.ssnitEmployee,
            ssnitEmployer: acc.ssnitEmployer + slip.ssnitEmployer,
            total: acc.total + slip.ssnitEmployee + slip.ssnitEmployer
        }), { ssnitEmployee: 0, ssnitEmployer: 0, total: 0 });

        return {
            success: true,
            data: {
                gra: graTotal,
                ssnit: ssnitTotal,
                count: payslips.length
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to generate compliance data' };
    }
}

