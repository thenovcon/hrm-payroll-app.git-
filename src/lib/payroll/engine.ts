import { TAX_BRACKETS, EMPLOYEE_PENSION_RATE } from './taxRates';

interface PayrollResult {
    basicSalary: number;
    totalAllowances: number;
    grossSalary: number;
    taxableIncome: number;
    incomeTax: number;
    ssnitEmployee: number; // Tier 1 (5.5%)
    totalDeductions: number;
    netPay: number;
}

export function calculatePayroll(basicSalary: number, allowances: { amount: number, taxable: boolean }[] = []): PayrollResult {
    // 1. Calculate Gross
    const totalAllowances = allowances.reduce((sum, a) => sum + a.amount, 0);
    const grossSalary = basicSalary + totalAllowances;

    // 2. SSNIT Contribution (Deductible from Tax)
    // 5.5% of Basic Salary
    const ssnitEmployee = basicSalary * EMPLOYEE_PENSION_RATE;

    // 3. Taxable Income
    // Gross - SSNIT (Relief)
    // Note: Some allowances are non-taxable, logic simplified here assuming most cash allowances are taxable unless specified otherwise.
    // For MVP, we assume all provided allowances are taxable.
    const taxableIncome = grossSalary - ssnitEmployee;

    // 4. Calculate PAYE (Income Tax)
    let tax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of TAX_BRACKETS) {
        if (remainingIncome <= 0) break;

        const taxableAmount = Math.min(remainingIncome, bracket.limit);
        tax += taxableAmount * bracket.rate;
        remainingIncome -= taxableAmount;
    }

    // 5. Net Pay
    const totalDeductions = ssnitEmployee + tax;
    const netPay = grossSalary - totalDeductions;

    return {
        basicSalary,
        totalAllowances,
        grossSalary,
        taxableIncome,
        incomeTax: parseFloat(tax.toFixed(2)),
        ssnitEmployee: parseFloat(ssnitEmployee.toFixed(2)),
        totalDeductions: parseFloat(totalDeductions.toFixed(2)),
        netPay: parseFloat(netPay.toFixed(2)),
    };
}
