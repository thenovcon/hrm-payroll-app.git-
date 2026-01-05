import { prisma } from '@/lib/db/prisma';

export interface TaxBracket {
    limit: number;
    rate: number;
    cumulativeTax: number;
}

/**
 * Validates active employees for missing statutory data.
 */
export async function validatePayrollBatch() {
    const employees = await prisma.employee.findMany({
        where: { status: 'ACTIVE' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            ssnitNumber: true,
            ghanaCardNumber: true,
            tin: true
        }
    });

    const issues = employees.filter(e => !e.ssnitNumber || !e.ghanaCardNumber).map(e => ({
        employeeId: e.id,
        name: `${e.firstName} ${e.lastName}`,
        missing: [
            !e.ssnitNumber ? 'SSNIT Number' : '',
            !e.ghanaCardNumber ? 'Ghana Card' : ''
        ].filter(Boolean)
    }));

    return { valid: issues.length === 0, issues };
}

/**
 * Calculates GRA Tax using DB-sourced brackets.
 */
export async function calculateTaxDynamic(taxableIncome: number): Promise<number> {
    // 1. Fetch active brackets from DB (Cached ideally, but DB for now for Truth)
    const settings = await prisma.payrollSettings.findUnique({
        where: { id: 'GLOBAL' },
        include: { taxBrackets: { orderBy: { taxRate: 'asc' } } }
    });

    if (!settings || !settings.taxBrackets.length) {
        throw new Error('Tax Configuration Missing. Please run seed-statutory.');
    }

    let tax = 0;
    let remaining = taxableIncome;

    for (const bracket of settings.taxBrackets) {
        if (remaining <= 0) break;

        // UpperLimit null means infinity (Excess)
        const limit = bracket.upperLimit ?? Infinity;
        const amountInBracket = Math.min(remaining, limit);

        tax += amountInBracket * bracket.taxRate;
        remaining -= amountInBracket;
    }

    return parseFloat(tax.toFixed(2));
}

/**
 * Generates Statutory Reports Data (GRA & SSNIT)
 */
export async function generateStatutoryReports(runId: string) {
    const run = await prisma.payrollRun.findUnique({
        where: { id: runId },
        include: { payslips: { include: { employee: true } } }
    });

    if (!run) throw new Error('Run not found');

    // GRA Schedule Format
    const graRows = run.payslips.map(slip => ({
        TIN: slip.employee.tin || 'N/A',
        Name: `${slip.employee.lastName}, ${slip.employee.firstName}`,
        BasicSalary: slip.basicSalary,
        TotalCashEmoluments: slip.grossSalary, // Simplified
        TaxableIncome: slip.taxableIncome,
        TaxPayable: slip.incomeTax
    }));

    // SSNIT Contribution Format
    const ssnitRows = run.payslips.map(slip => ({
        SSNIT_No: slip.employee.ssnitNumber || 'N/A',
        Name: `${slip.employee.firstName} ${slip.employee.lastName}`,
        Salary: slip.basicSalary,
        Worker_5_5: slip.ssnitEmployee,
        Employer_13: slip.ssnitEmployer,
        Total_18_5: (slip.ssnitEmployee + slip.ssnitEmployer).toFixed(2)
    }));

    return { graRows, ssnitRows };
}
