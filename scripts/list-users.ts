import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        take: 20,
        include: { employee: true }
    });

    console.log('| Username | Role | Position | Department |');
    console.log('|---|---|---|---|');
    for (const u of users) {
        console.log(`| ${u.username} | ${u.role} | ${u.employee?.position} | ${u.employee?.departmentId} |`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
