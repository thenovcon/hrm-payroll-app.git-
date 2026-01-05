
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await hash('admin123', 10);

    // 1. Reset 'admin' (Generic Admin)
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { password },
        create: {
            username: 'admin',
            password,
            role: 'ADMIN',
            employee: {
                create: {
                    firstName: 'System', lastName: 'Admin', email: 'admin@novcon.com',
                    position: 'Administrator', dateJoined: new Date(), employeeId: 'ADM-001',
                    dateOfBirth: new Date(), gender: 'MALE', phone: '000', employmentType: 'Permanent',
                    salaryStructure: { create: { basicSalary: 1000 } }
                }
            }
        }
    });
    console.log(`✅ Reset password for user 'admin' to 'admin123'`);

    // 2. Reset 'mduodu' (Owner/Requested Admin)
    const owner = await prisma.user.findUnique({ where: { username: 'mduodu' } });
    if (owner) {
        await prisma.user.update({
            where: { username: 'mduodu' },
            data: { password }
        });
        console.log(`✅ Reset password for user 'mduodu' to 'admin123'`);
    } else {
        console.log(`⚠️ User 'mduodu' not found.`);
    }

    // 3. Reset others for safety
    const others = ['cobbina', 'line_manager', 'yaw', 'hr_manager', 'employee'];
    const commonPwd = await hash('password123', 10);

    for (const u of others) {
        const user = await prisma.user.findUnique({ where: { username: u } });
        if (user) {
            await prisma.user.update({
                where: { username: u },
                data: { password: commonPwd }
            });
            console.log(`✅ Reset password for user '${u}' to 'password123'`);
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
