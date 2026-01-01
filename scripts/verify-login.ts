
import { prisma } from '../src/lib/db/prisma';

async function verifyUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { username: 'thenovcon@gmail.com' },
            select: { id: true, username: true, role: true, status: true }
        });

        if (user) {
            console.log('✅ User found:', user);
        } else {
            console.error('❌ User "thenovcon@gmail.com" NOT found.');
        }
    } catch (error) {
        console.error('❌ Error verifying user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyUser();
