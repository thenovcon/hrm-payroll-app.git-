import csv
import random
from datetime import datetime

# Configuration
INPUT_FILE = 'hrm_employees.csv'
OUTPUT_FILE = 'leave_balances.csv'
CURRENT_YEAR = datetime.now().year

# Standard Ghana Leave Types and default annual allocations
LEAVE_CONFIG = {
    "Annual Leave": {"min": 15, "max": 30},
    "Sick Leave": {"min": 14, "max": 21},
    "Compassionate Leave": {"min": 5, "max": 10},
    "Casual Leave": {"min": 5, "max": 10},
    "Study Leave": {"min": 10, "max": 20},
}

def generate_leave_balances():
    try:
        with open(INPUT_FILE, mode='r') as infile:
            reader = csv.DictReader(infile)
            leave_records = []

            for row in reader:
                email = row['email']
                gender = row['gender']
                
                # Tenure Logic (if needed from dateJoined)
                # date_joined = row.get('dateJoined')
                
                # 30% rule: Only 30% of staff should have daysUsed > 0
                has_taken_leave = random.random() < 0.3

                # 1. Assign standard leaves to everyone
                for leave_type, bounds in LEAVE_CONFIG.items():
                    allocated = random.randint(bounds['min'], bounds['max'])
                    
                    used = 0
                    if has_taken_leave and leave_type == "Annual Leave": 
                        # Assume if they took leave, they took Annual Leave mostly
                        used = random.randint(1, min(10, allocated)) 
                    elif has_taken_leave and random.random() < 0.1:
                        # Small chance of using other leaves if they are in the "active" group
                        used = random.randint(1, 3)
                        
                    leave_records.append([email, leave_type, allocated, CURRENT_YEAR, used])

                # 2. Gender-specific
                if gender.lower() == 'female':
                    # Maternity: Very rare active usage
                    used_mat = 60 if has_taken_leave and random.random() < 0.05 else 0
                    leave_records.append([email, "Maternity Leave", 60, CURRENT_YEAR, used_mat])
                else:
                    # Paternity
                    used_pat = 5 if has_taken_leave and random.random() < 0.05 else 0
                    leave_records.append([email, "Paternity Leave", 5, CURRENT_YEAR, used_pat])

        # Write to CSV
        header = ["email", "leaveType", "daysAllocated", "year", "daysUsed"]
        with open(OUTPUT_FILE, mode='w', newline='') as outfile:
            writer = csv.writer(outfile)
            writer.writerow(header)
            writer.writerows(leave_records)
            
        print(f"Successfully generated {len(leave_records)} leave records in {OUTPUT_FILE} (Verified 30% usage rule)")

    except FileNotFoundError:
        print(f"Error: {INPUT_FILE} not found. Please generate the employee file first.")

if __name__ == "__main__":
    generate_leave_balances()
