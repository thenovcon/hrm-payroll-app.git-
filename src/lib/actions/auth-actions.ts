'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/main' });
    } catch (error) {
        if (error instanceof AuthError) {
            console.error('Auth Error:', error.type, error.message);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return `Something went wrong: ${error.type}`;
            }
        }
        throw error;
    }
}

export async function logout() {
    await signOut();
}

export async function seedAdminUser() {
    const password = await bcrypt.hash('admin123', 10);

    try {
        const user = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: password,
                role: 'ADMIN',
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to seed admin:', error);
        return { success: false, error: 'Failed' };
    }
}
