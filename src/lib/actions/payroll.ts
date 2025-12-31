'use server';

import { prisma } from '@/lib/db/prisma';
import { calculatePayroll } from '@/lib/payroll/engine';
import { revalidatePath } from 'next/cache';
import { SSNIT_TIER_1_EMPLOYER_RATE, TIER_2_EMPLOYER_RATE } from '@/lib/payroll/taxRates';

// --- Salary Management ---
export async function updateSalary(employeeId: string, basicSalary: number) {
    try {
        await prisma.salaryStructure.upsert({
            where: { employeeId },
            update: { basicSalary },
            create: { employeeId, basicSalary, allowances: '[]' },
        });
        revalidatePath(`/employees/${employeeId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update salary:', error);
        return { success: false, error: 'Failed to update salary' };
    }
}

export async function getSalary(employeeId: string) {
    try {
        const salary = await prisma.salaryStructure.findUnique({
            where: { employeeId },
        });
        return { success: true, data: salary };
    } catch (error) {
        return { success: false, error: 'Failed to fetch salary' };
    }
}

// --- Payroll Execution ---
export async function createPayrollRun(month: number, year: number) {
    try {
        // 1. Check if run exists
        const existingRun = await prisma.payrollRun.findUnique({
            where: { month_year: { month, year } },
        });

        if (existingRun) {
            return { success: false, error: 'Payroll run already exists for this period.' };
        }

        // 2. Fetch all active employees with salary structure
        const employees = await prisma.employee.findMany({
            where: { status: 'ACTIVE' },
            include: { salaryStructure: true },
        });

        if (employees.length === 0) {
            return { success: false, error: 'No active employees to process.' };
        }

        // 3. Create Draft Run
        const run = await prisma.payrollRun.create({
            data: { month, year, status: 'DRAFT' },
        });

        let totalCost = 0;
        let totalNet = 0;

        // 4. Calculate for each employee
        for (const emp of employees) {
            if (!emp.salaryStructure) continue;

            const salary = emp.salaryStructure.basicSalary;
            const calc = calculatePayroll(salary);

            // Employer Costs (Tier 1 + Tier 2) - Not deducted from employee, but cost to company
            const employerTier1 = salary * SSNIT_TIER_1_EMPLOYER_RATE; // 13%
            const employerTier2 = salary * TIER_2_EMPLOYER_RATE;     // 0% or 5% depending on config

            const employerCost = employerTier1 + employerTier2; // Add other costs here if needed

            await prisma.payslip.create({
                data: {
                    payrollRunId: run.id,
                    employeeId: emp.id,
                    basicSalary: calc.basicSalary,
                    totalAllowances: calc.totalAllowances,
                    grossSalary: calc.grossSalary,
                    taxableIncome: calc.taxableIncome,
                    incomeTax: calc.incomeTax,
                    ssnitEmployee: calc.ssnitEmployee,
                    ssnitEmployer: parseFloat(employerTier1.toFixed(2)),
                    tier2Employee: 0, // Placeholder
                    tier2Employer: parseFloat(employerTier2.toFixed(2)),
                    totalDeductions: calc.totalDeductions,
                    netPay: calc.netPay,
                },
            });

            totalCost += (calc.grossSalary + employerCost);
            totalNet += calc.netPay;
        }

        // 5. Update Run Totals
        await prisma.payrollRun.update({
            where: { id: run.id },
            data: { totalCost, totalNetPay: totalNet },
        });

        revalidatePath('/payroll');
        return { success: true };

    } catch (error) {
        console.error('Payroll Run Failed:', error);
        return { success: false, error: 'Payroll Run Failed' };
    }
}

export async function getPayrollRuns() {
    try {
        const runs = await prisma.payrollRun.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { payslips: true } } }
        });
        return { success: true, data: runs };
    } catch (error) {
        return { success: false, error: 'Failed' };
    }
}

export async function getPayslips(runId: string) {
    try {
        const payslips = await prisma.payslip.findMany({
            where: { payrollRunId: runId },
            include: { employee: true },
        });
        return { success: true, data: payslips };
    } catch (error) {
        return { success: false, error: 'Failed' };
    }
}
