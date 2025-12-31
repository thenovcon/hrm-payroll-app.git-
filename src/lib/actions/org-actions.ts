'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// --- DEPARTMENT ACTIONS ---

export async function getDepartments() {
    try {
        const departments = await prisma.department.findMany({
            include: {
                head: { select: { firstName: true, lastName: true } },
                parentDept: { select: { name: true } },
                _count: { select: { employees: true, subDepartments: true } }
            },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: departments };
    } catch (error) {
        return { success: false, error: 'Failed to fetch departments' };
    }
}

export async function createDepartment(data: {
    name: string;
    code: string;
    description?: string;
    headId?: string;
    parentDeptId?: string;
}) {
    try {
        const department = await prisma.department.create({ data });
        revalidatePath('/settings');
        revalidatePath('/admin');
        return { success: true, data: department };
    } catch (error) {
        return { success: false, error: 'Failed to create department' };
    }
}

export async function updateDepartment(id: string, data: {
    name?: string;
    code?: string;
    description?: string;
    headId?: string;
    parentDeptId?: string;
}) {
    try {
        const department = await prisma.department.update({
            where: { id },
            data
        });
        revalidatePath('/settings');
        revalidatePath('/admin');
        return { success: true, data: department };
    } catch (error) {
        return { success: false, error: 'Failed to update department' };
    }
}

export async function getDepartmentHierarchy(deptId: string) {
    try {
        const dept = await prisma.department.findUnique({
            where: { id: deptId },
            include: {
                head: true,
                employees: { select: { id: true, firstName: true, lastName: true, position: true } },
                subDepartments: {
                    include: {
                        head: { select: { firstName: true, lastName: true } },
                        _count: { select: { employees: true } }
                    }
                }
            }
        });
        return { success: true, data: dept };
    } catch (error) {
        return { success: false, error: 'Failed to fetch department hierarchy' };
    }
}
