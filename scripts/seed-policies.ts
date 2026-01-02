
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding HR Policies...");

    const policies = [
        {
            title: "Annual Leave Policy",
            category: "Leave",
            content: "Employees are entitled to 20 working days of paid annual leave per year after completing 12 months of continuous service. Requests must be submitted 2 weeks in advance."
        },
        {
            title: "Remote Work Policy",
            category: "Workplace",
            content: "Eligible employees may work remotely up to 2 days per week. Approval is at the discretion of the Department Head based on role suitability and performance."
        },
        {
            title: "Code of Conduct",
            category: "Conduct",
            content: "All employees must maintain professional behavior. Bullying, harassment, and discrimination are strictly prohibited and will result in disciplinary action up to termination."
        },
        {
            title: "Sick Leave Policy",
            category: "Leave",
            content: "Employees are granted up to 10 days of paid sick leave per year. A medical certificate is required for absences exceeding 2 consecutive days."
        },
        {
            title: "Overtime Policy",
            category: "Compensation",
            content: "Overtime work must be authorized in advance by a manager. Authorized overtime is compensated at 1.5x the hourly rate for weekdays and 2.0x for weekends/holidays."
        }
    ];

    // Better logic for seed if unique constraint unknown
    for (const p of policies) {
        const existing = await prisma.hRPolicy.findFirst({ where: { title: p.title } });
        if (!existing) {
            await prisma.hRPolicy.create({
                data: {
                    title: p.title,
                    category: p.category,
                    content: p.content
                }
            });
            console.log(`Created: ${p.title}`);
        } else {
            console.log(`Skipped: ${p.title} (Exists)`);
        }
    }

    console.log("✅ Policy Seeding Complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
