'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// --- COMPANY PROFILE ---

export async function getCompanyProfile() {
    try {
        const profile = await prisma.companyProfile.findUnique({
            where: { id: 'GLOBAL' }
        });
        return { success: true, data: profile };
    } catch (error) {
        return { success: false, error: 'Failed to fetch company profile' };
    }
}

export async function updateCompanyProfile(data: any) {
    try {
        const profile = await prisma.companyProfile.upsert({
            where: { id: 'GLOBAL' },
            update: data,
            create: { ...data, id: 'GLOBAL' }
        });
        revalidatePath('/settings');
        return { success: true, data: profile };
    } catch (error) {
        return { success: false, error: 'Failed to update company profile' };
    }
}

// --- WORKFLOWS ---

export async function getWorkflowConfigs() {
    try {
        const configs = await prisma.workflowConfig.findMany({
            orderBy: { module: 'asc' }
        });
        return { success: true, data: configs };
    } catch (error) {
        return { success: false, error: 'Failed to fetch workflow configs' };
    }
}

export async function updateWorkflowConfig(id: string, data: any) {
    try {
        const config = await prisma.workflowConfig.update({
            where: { id },
            data
        });
        revalidatePath('/settings');
        return { success: true, data: config };
    } catch (error) {
        return { success: false, error: 'Failed to update workflow config' };
    }
}

// --- ROLES & PERMISSIONS ---

export async function getRolePermissions() {
    try {
        const permissions = await prisma.rolePermission.findMany({
            orderBy: { role: 'asc' }
        });
        return { success: true, data: permissions };
    } catch (error) {
        return { success: false, error: 'Failed to fetch role permissions' };
    }
}

export async function updateRolePermission(role: string, permissions: string) {
    try {
        const perm = await prisma.rolePermission.upsert({
            where: { role },
            update: { permissions },
            create: { role, permissions }
        });
        revalidatePath('/settings');
        return { success: true, data: perm };
    } catch (error) {
        return { success: false, error: 'Failed to update role permissions' };
    }
}
