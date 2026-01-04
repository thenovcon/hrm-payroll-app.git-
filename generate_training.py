import csv
import random
from datetime import datetime, timedelta

# Role-Based Certifications
CERT_MAP = {
    "HR": [("SHRM-CP", "SHRM"), ("PHR", "HRCI"), ("Conflict Resolution", "LinkedIn Learning")],
    "Finance": ["CPA", "ACCA", "Financial Modeling", "Excel Expert"],
    "IT": [("AWS Certified Developer", "AWS"), ("Google Cloud Architect", "Google"), ("React Nanodegree", "Udacity"), ("Cybersecurity Fundamentals", "CompTIA")],
    "Sales": ["Salesforce Administrator", "Negotiation Masterclass", "Strategic Selling"],
    "Marketing": ["Google Analytics", "Digital Marketing Specialist", "SEO Fundamentals"],
    "Legal": ["Corporate Law Certificate", "Compliance Ethics"],
    "Operations": ["Project Management Professional (PMP)", "Six Sigma Green Belt", "Supply Chain Management"]
}

def generate_training_records():
    records = []
    try:
        with open('hrm_employees.csv', mode='r') as f:
            reader = csv.DictReader(f)
            employees = list(reader)
            
            # 40% of employees have some certification
            users_with_certs = random.sample(employees, k=int(len(employees) * 0.4))
            
            for emp in users_with_certs:
                dept = emp['department']
                email = emp['email']
                
                # Get relevant certs for department, fallback to generic
                possible_certs = CERT_MAP.get(dept, [("General Management", "Alison"), ("Workplace Safety", "OSHA")])
                
                # Pick 1-2 certs
                selected_certs = random.sample(possible_certs, k=random.randint(1, min(2, len(possible_certs))))
                
                for cert in selected_certs:
                    # Handle tuple vs string (mixed format in map above was mistake, fixing here)
                    if isinstance(cert, tuple):
                        name, issuer = cert
                    else:
                        name, issuer = cert, "Professional Institute"
                        
                    # Random issue date in last 3 years
                    days_ago = random.randint(10, 1000)
                    issue_date = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
                    url = f"https://certs.provider.com/verify/{random.randint(10000,99999)}"
                    
                    records.append([email, name, issuer, issue_date, url])

        # Write to CSV
        header = ["email", "name", "issuer", "issueDate", "url"]
        with open('training_certifications.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(records)
            
        print(f"Successfully generated {len(records)} training records in training_certifications.csv")

    except FileNotFoundError:
        print("Error: hrm_employees.csv not found.")

if __name__ == "__main__":
    generate_training_records()
