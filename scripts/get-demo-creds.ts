import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const roles = ['ADMIN', 'HR_MANAGER', 'PAYROLL_OFFICER', 'ACCOUNTANT', 'DEPT_HEAD', 'EMPLOYEE'];

    console.log('| Role | Username | Password | Position | Department |');
    console.log('|---|---|---|---|---|');

    for (const role of roles) {
        const user = await prisma.user.findFirst({
            where: { role: role as any },
            include: { employee: { include: { department: true } } }
        });

        if (user) {
            const position = user.employee?.position || 'N/A';
            const dept = user.employee?.department?.name || 'N/A';
            // Assuming default password based on seed scripts
            const password = user.username === 'admin' || user.username === 'mduodu' ? 'admin123' : 'password123';

            console.log(`| **${role}** | \`${user.username}\` | \`${password}\` | ${position} | ${dept} |`);
        } else {
            console.log(`| **${role}** | *Not Found* | - | - | - |`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
