import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma'; // Fixed import path to match your project structure
import { redirect } from 'next/navigation';

export default async function MyProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect('/login');
    }

    // Find the employee record associated with this user
    const employee = await prisma.employee.findFirst({
        where: {
            email: session.user.email,
        },
        select: {
            id: true,
        },
    });

    if (employee) {
        redirect(`/employees/${employee.id}`);
    } else {
        // Fallback if no employee record is found (e.g. admin without employee profile)
        // You might want to show a "Profile not found" page or redirect to home
        redirect('/employees');
    }
}
