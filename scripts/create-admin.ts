
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await hash('novcon123', 10);

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password,
            role: 'ADMIN',
            status: 'ACTIVE'
        },
        create: {
            username: 'admin',
            password,
            role: 'ADMIN',
            status: 'ACTIVE'
        }
    });

    console.log('Admin user created/updated:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
