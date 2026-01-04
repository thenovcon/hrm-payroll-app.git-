import csv
import random

# Configuration
DEPARTMENTS = ["HR", "Finance", "Operations", "IT", "Sales", "Legal", "Marketing"]
LOCATIONS = ["Accra", "Kumasi", "Takoradi", "Remote", "Tema"]
STATUSES = ["OPEN", "DRAFT", "FILLED", "CANCELLED"]

TITLES = {
    "HR": ["Talent Acquisition Lead", "HR Intern", "Benefits Specialist"],
    "Finance": ["Senior Accountant", "Payroll Analyst"],
    "Operations": ["Driver", "Logistics Officer", "Warehouse Manager"],
    "IT": ["Frontend Developer", "Backend Developer", "Product Manager", "Data Scientist"],
    "Sales": ["Sales Associate", "Regional Manager"],
    "Legal": ["Legal Counsel"],
    "Marketing": ["Brand Manager", "Graphic Designer"]
}

def generate_ats_requisitions(count=50):
    requisitions = []
    
    for i in range(count):
        dept = random.choice(DEPARTMENTS)
        title = random.choice(TITLES.get(dept, ["Staff"]))
        location = random.choice(LOCATIONS)
        status = random.choice(STATUSES)
        
        # Bias towards OPEN for demo purposes
        if random.random() < 0.6: status = "OPEN"
        
        req_number = f"REQ-{2025}-{1000+i}"
        headcount = random.randint(1, 3)
        
        requisitions.append([req_number, title, dept, location, status, headcount])

    # Write to CSV
    header = ["reqNumber", "title", "department", "location", "status", "headcount"]
    with open('ats_requisitions.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(requisitions)
    
    print(f"Successfully generated {count} ATS requisitions in ats_requisitions.csv")

if __name__ == "__main__":
    generate_ats_requisitions(50)
