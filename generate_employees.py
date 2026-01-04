import csv
import random

from datetime import datetime, timedelta

# Common Ghanaian First Names (Male & Female)
first_names = [
    "Kofi", "Ama", "Kwame", "Abena", "Kwesi", "Akosua", "Kojo", "Adjoa", "Kwaku", "Akua",
    "Yaw", "Yaa", "Kow", "Afia", "Emmanuel", "Prince", "Samuel", "Michael", "Isaac", "Daniel",
    "Abigail", "Nana", "Maame", "Gifty", "Blessing", "Sampson", "Ebenezer", "Patricia", "Rita"
]

# Common Ghanaian Surnames
last_names = [
    "Mensah", "Boateng", "Owusu", "Yeboah", "Osei", "Appiah", "Asare", "Acheampong", "Adjei",
    "Adu", "Annan", "Amankwah", "Baah", "Bonsu", "Donkor", "Danquah", "Frimpong", "Gyamfi",
    "Kwarteng", "Nkansah", "Oppong", "Quansah", "Sarpong", "Tetteh", "Turkson", "Yiadom"
]


# Department-specific roles for better realism
dept_roles = {
    "HR": ["HR Assistant", "HR Officer", "Talent Acquisition Specialist", "Benefits Coordinator"],
    "Finance": ["Accountant", "Payroll Clerk", "Auditor", "Financial Analyst"],
    "Operations": ["Operations Officer", "Logistics Coordinator", "Admin Assistant", "Facility Coordinator"],
    "IT": ["Software Engineer", "System Administrator", "IT Support Specialist", "DevOps Engineer", "QA Analyst"],
    "Sales": ["Sales Representative", "Account Executive", "Business Development Assoc."],
    "Legal": ["Legal Assistant", "Paralegal", "Compliance Officer"],
    "Marketing": ["Content Creator", "SEO Specialist", "Social Media Manager", "Marketing Executive"]
}

departments = list(dept_roles.keys())
genders = ["Male", "Female"]

def generate_employee_data(count=2000):
    employees = []
    current_date = datetime.now()
    
    for i in range(count):
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        email = f"{fname.lower()}.{lname.lower()}.{i+1}@thenoveltyconcepts.com"
        dept = random.choice(departments)
        gender = random.choice(genders)
        phone = f"+23320{random.randint(1000000, 9999999)}"
        
        # Tenure Logic
        tenure_years = random.uniform(0, 10)
        days_employed = int(tenure_years * 365)
        date_joined = (current_date - timedelta(days=days_employed)).strftime('%Y-%m-%d')

        # Role & Salary Logic (10% Managers)
        is_manager = random.random() < 0.10
        
        if is_manager:
            pos = f"{dept} Manager" # Simple manager title
            if random.random() < 0.1: pos = f"Head of {dept}" # Super senior
            if random.random() < 0.05: pos = "Director"
            salary = random.randint(12000, 25000)
        else:
            # Pick a realistic individual contributor role for the Dept
            possible_roles = dept_roles.get(dept, ["Officer"])
            pos = random.choice(possible_roles)
            salary = random.randint(3000, 11000)
        
        employees.append([fname, lname, email, dept, pos, salary, gender, phone, date_joined])
    return employees

# Save to CSV
header = ["firstName", "lastName", "email", "department", "position", "basicSalary", "gender", "phone", "dateJoined"]
data = generate_employee_data(2000)

with open('hrm_employees.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(data)

print("Successfully generated hrm_employees.csv with 2000 records (including tenure).")
