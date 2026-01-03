'use server';

import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            include: { employee: true }
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: 'Failed to fetch users' };
    }
}

export async function createUser(prevState: any, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    const employeeId = formData.get('employeeId') as string | null;

    if (!username || !password || !role) {
        return { success: false, error: 'Missing required fields' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role,
                employeeId: employeeId || null,
            },
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        console.error('Create User Failed:', error);
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0];
            if (field === 'username') return { success: false, error: 'Username is already taken.' };
            if (field === 'employeeId') return { success: false, error: 'This employee is already linked to a user account.' };
        }
        return { success: false, error: 'Failed to create user. Please try again.' };
    }
}
