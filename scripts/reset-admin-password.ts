
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Resetting Admin Password...');
    const hashedPassword = await hash('admin123', 10);

    const user = await prisma.user.update({
        where: { username: 'admin' },
        data: { password: hashedPassword }
    });

    console.log(`✅ Updated password for user: ${user.username} to 'admin123'`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
