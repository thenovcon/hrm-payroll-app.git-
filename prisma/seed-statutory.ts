import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Statutory Settings...');

    // 1. GRA Tax Brackets (Monthly - 2024)
    // First 490 = 0%
    // Next 110 = 5%
    // Next 130 = 10%
    // Next 3,166.67 = 17.5%
    // Next 16,000 = 25%
    // Next 30,520 = 30%
    // Excess = 35%

    const taxBrackets = [
        { limit: 490, rate: 0, cumulativeTax: 0 },
        { limit: 110, rate: 0.05, cumulativeTax: 5.5 },
        { limit: 130, rate: 0.10, cumulativeTax: 13 },
        { limit: 3166.67, rate: 0.175, cumulativeTax: 554.17 },
        { limit: 16000, rate: 0.25, cumulativeTax: 4000 },
        { limit: 30520, rate: 0.30, cumulativeTax: 9156 },
        { limit: 99999999, rate: 0.35, cumulativeTax: 0 } // Excess
    ];

    // Upsert Global Settings
    const settings = await prisma.payrollSettings.upsert({
        where: { id: 'GLOBAL' },
        update: {
            ssnitEmployeeRate: 5.5,
            ssnitEmployerRate: 13.0,
            tier2EmployeeRate: 0, // Usually bundled or separate, keeping 0 for now as Tier 2 is private
            tier2EmployerRate: 0,
            tier3Enabled: true,
            tier3EmployeeRate: 0, // Optional
            tier3EmployerRate: 0,
        },
        create: {
            id: 'GLOBAL',
            ssnitEmployeeRate: 5.5,
            ssnitEmployerRate: 13.0,
            tier3Enabled: true,
        }
    });

    console.log('Global Settings upserted:', settings.id);

    // Clear existing brackets to avoid dupes/conflicts
    await prisma.taxBracket.deleteMany({ where: { settingsId: 'GLOBAL' } });

    // Insert Brackets
    for (const discount of taxBrackets) {
        await prisma.taxBracket.create({
            data: {
                settingsId: 'GLOBAL',
                upperLimit: discount.limit,
                taxRate: discount.rate,
                cumulativeTax: discount.cumulativeTax,
                activeYear: 2024
            }
        });
    }

    console.log('Tax Brackets seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
