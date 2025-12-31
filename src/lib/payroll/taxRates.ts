// Ghana Payroll Constants (2024/2025)

// SSNIT / Tier Rates
export const SSNIT_TIER_1_EMPLOYEE_RATE = 0.055; // 5.5%
export const SSNIT_TIER_1_EMPLOYER_RATE = 0.13;  // 13%

// TIER 2 (5%)
export const TIER_2_EMPLOYEE_RATE = 0.0; // Usually 0% direct deduction if we follow the 5.5/13 split strictly for Tier 1
export const TIER_2_EMPLOYER_RATE = 0.05; // 5% Employer contribution to Tier 2

export const EMPLOYEE_PENSION_RATE = 0.055;

// GRA 2024 Monthly Income Tax Rates (Effective Jan 2024 est/Current)
// Chargeable Income (GHS) | Rate (%)
// First 490               | Free
// Next 110                | 5%
// Next 130                | 10%
// Next 3,000              | 17.5%
// Next 16,395             | 25%
// Next 29,875             | 30%
// Exceeding 50,000        | 35%

export const TAX_BRACKETS = [
    { limit: 490, rate: 0 },
    { limit: 110, rate: 0.05 },
    { limit: 130, rate: 0.10 },
    { limit: 3000, rate: 0.175 },
    { limit: 16395, rate: 0.25 },
    { limit: 29875, rate: 0.30 },
    { limit: Infinity, rate: 0.35 },
];
