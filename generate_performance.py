import csv
import random

GOAL_TEMPLATES = [
    ("Improve efficiency", "Reduce turnaround time by 10%"),
    ("Skill Acquisition", "Complete advanced certification"),
    ("Leadership", "Mentor 2 junior staff members"),
    ("Compliance", "Ensure 100% adherence to new safety protocols"),
    ("Sales Target", "Achieve Q1 sales quota of GHS 50,000"),
    ("Documentation", "Update standard operating procedures (SOPs)")
]

STATUSES = ["IN_PROGRESS", "COMPLETED", "NOT_STARTED", "MISSED"]

def generate_performance_goals():
    goals = []
    try:
        # Load employees to assign goals to
        with open('hrm_employees.csv', mode='r') as f:
            reader = csv.DictReader(f)
            employees = list(reader)
            
            # Select random subset of employees (e.g., 60% have active goals)
            selected_employees = random.sample(employees, k=int(len(employees) * 0.6))
            
            for emp in selected_employees:
                # Give each employee 1-3 goals
                num_goals = random.randint(1, 3)
                
                for _ in range(num_goals):
                    template = random.choice(GOAL_TEMPLATES)
                    title = template[0]
                    desc = template[1]
                    status = random.choice(STATUSES)
                    
                    # Logic: Completed = 100%, In Progress = Random, Not Started = 0
                    progress = 0
                    if status == "COMPLETED": progress = 100
                    elif status == "IN_PROGRESS": progress = random.randint(10, 90)
                    
                    goals.append([emp['email'], title, desc, status, progress])

        # Write to CSV
        header = ["email", "title", "description", "status", "progress"]
        with open('performance_goals.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(header)
            writer.writerows(goals)
        
        print(f"Successfully generated {len(goals)} performance goals in performance_goals.csv")

    except FileNotFoundError:
        print("Error: hrm_employees.csv not found.")

if __name__ == "__main__":
    generate_performance_goals()
