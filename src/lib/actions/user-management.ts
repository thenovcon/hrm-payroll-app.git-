'use server';

import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all users with basic info
 */
export async function getAllUsers() {
    try {
        const users = await prisma.user.findMany({
            include: {
                employee: {
                    select: {
                        firstName: true,
                        lastName: true,
                        position: true,
                        department: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform for UI
        return {
            success: true,
            data: users.map(u => ({
                id: u.id,
                username: u.username,
                email: u.email || u.employee?.email || 'N/A', // Fallback
                role: u.role,
                status: u.status,
                name: u.employee ? `${u.employee.firstName} ${u.employee.lastName}` : u.username,
                department: u.employee?.department?.name || '-',
                lastActive: 'Now' // Mock for now
            }))
        };
    } catch (error: any) {
        console.error('Get Users Error:', error);
        return { success: false, error: 'Failed to fetch users' };
    }
}

/**
 * Create a New User
 */
export async function createUser(data: any) {
    try {
        // Validation
        if (!data.username || !data.password || !data.role) {
            return { success: false, error: 'Missing required fields' };
        }

        const existing = await prisma.user.findFirst({
            where: { username: data.username }
        });
        if (existing) return { success: false, error: 'Username already exists' };

        const hashedPassword = await hash(data.password, 10);

        // If email provided, check if employee exists to link
        let employeeId = null;
        if (data.email) {
            const emp = await prisma.employee.findUnique({ where: { email: data.email } });
            if (emp) employeeId = emp.id;
        }

        await prisma.user.create({
            data: {
                username: data.username,
                password: hashedPassword,
                role: data.role,
                status: 'ACTIVE',
                employeeId: employeeId
            }
        });

        revalidatePath('/settings');
        return { success: true, message: 'User created successfully' };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Update User Role or Status
 */
export async function updateUser(id: string, data: any) {
    try {
        const updateData: any = {};
        if (data.role) updateData.role = data.role;
        if (data.status) updateData.status = data.status;
        if (data.password) updateData.password = await hash(data.password, 10);

        await prisma.user.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/settings');
        return { success: true, message: 'User updated' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

/**
 * Deactivate User (Soft Delete)
 */
export async function deleteUser(id: string) {
    try {
        await prisma.user.update({
            where: { id },
            data: { status: 'INACTIVE' }
        });
        revalidatePath('/settings');
        return { success: true, message: 'User deactivated' };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
