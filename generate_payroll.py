import csv
import random

# Latest 2025-2026 Ghana Monthly PAYE Tax Bands
TAX_BANDS = [
    (490, 0.00),     # First GHS 490
    (110, 0.05),     # Next GHS 110
    (130, 0.10),     # Next GHS 130
    (3166.67, 0.175),# Next GHS 3,166.67
    (16000, 0.25),   # Next GHS 16,000
    (30520, 0.30),   # Next GHS 30,520
    (float('inf'), 0.35) # Above GHS 50,416.67
]

def calculate_ghana_tax(taxable_income):
    tax = 0
    remaining = taxable_income
    for limit, rate in TAX_BANDS:
        if remaining <= 0: break
        taxable_amount = min(remaining, limit)
        tax += taxable_amount * rate
        remaining -= taxable_amount
    return round(tax, 2)

def generate_payroll_ytd():
    employees = []
    # Load your existing employee data
    try:
        with open('hrm_employees.csv', mode='r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                # Basic info from existing file
                email = row['email']
                basic_salary = float(row['basicSalary'])
                
                # Generate history for Jan to Dec 2025
                for month in range(1, 13):
                    # Calculate SSNIT (5.5% of Basic)
                    ssnit_employee = round(basic_salary * 0.055, 2)
                    
                    # Chargeable Income = Gross (assuming no extra allowances for now) - SSNIT
                    gross_salary = basic_salary 
                    taxable_income = gross_salary - ssnit_employee
                    
                    # Calculate PAYE Tax
                    income_tax = calculate_ghana_tax(taxable_income)
                    
                    # Final Net Pay
                    net_pay = round(taxable_income - income_tax, 2)
                    
                    employees.append({
                        "email": email,
                        "month": month,
                        "year": 2025,
                        "basicSalary": basic_salary,
                        "grossSalary": gross_salary,
                        "incomeTax": income_tax,
                        "ssnitEmployee": ssnit_employee,
                        "netPay": net_pay
                    })

        # Write to CSV
        keys = employees[0].keys()
        with open('payroll_history_ytd.csv', 'w', newline='') as f:
            dict_writer = csv.DictWriter(f, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(employees)
        
        print(f"Generated {len(employees)} payroll records (for {len(employees)//12} employees x 12 months).")

    except FileNotFoundError:
        print("Error: hrm_employees.csv not found. Please run generate_employees.py first.")

if __name__ == "__main__":
    generate_payroll_ytd()
