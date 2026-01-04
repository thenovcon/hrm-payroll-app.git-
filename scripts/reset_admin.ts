
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
    const password = await hash('novcon123', 10);

    console.log("🔄 Attempting to reset 'admin' password...");

    try {
        const user = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {
                password: password,
                role: 'ADMIN',
                status: 'ACTIVE'
            },
            create: {
                username: 'admin',
                password: password,
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        });

        console.log(`✅ Admin User Reset Successful:`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password set to: 'novcon123'`);

    } catch (e) {
        console.error("❌ Error resetting admin:", e);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
