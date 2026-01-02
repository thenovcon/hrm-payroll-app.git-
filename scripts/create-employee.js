const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'employee@novcon.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create Employee
        const employee = await prisma.employee.upsert({
            where: { email },
            update: {},
            create: {
                firstName: 'Kwame',
                lastName: 'Mensah',
                email,
                phone: '0201234567',
                gender: 'Male',
                dateOfBirth: new Date('1990-01-01'),
                dateJoined: new Date(),
                employmentType: 'Permanent',
                position: 'Software Engineer',
                employeeId: 'EMP-005',
                status: 'ACTIVE'
            }
        });

        // 2. Create User linked to Employee
        const user = await prisma.user.upsert({
            where: { username: 'employee' },
            update: {
                password: hashedPassword, // Reset password just in case
                employeeId: employee.id
            },
            create: {
                username: 'employee',
                password: hashedPassword,
                role: 'EMPLOYEE',
                employeeId: employee.id
            }
        });

        console.log(`✅ Created/Updated Employee User:`);
        console.log(`   Username: employee`);
        console.log(`   Password: ${password}`);
        console.log(`   Role: ${user.role}`);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
