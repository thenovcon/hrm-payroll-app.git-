'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// ... existing imports

// Helper to serialize deep objects to plain JSON safe types
const serialize = (obj: any): any => JSON.parse(JSON.stringify(obj));

export async function getLeaveBalances(employeeId: string) {
    try {
        const balances = await prisma.leaveBalance.findMany({
            where: { employeeId },
            include: { leaveType: true },
            orderBy: { year: 'desc' },
        });
        return { success: true, data: serialize(balances) };
    } catch (error) {
        console.error('Failed to fetch leave balances:', error);
        return { success: false, error: 'Failed to fetch leave balances' };
    }
}

export async function getLeaveTypes() {
    try {
        const types = await prisma.leaveType.findMany({
            orderBy: { name: 'asc' },
        });
        return { success: true, data: serialize(types) };
    } catch (error) {
        console.error('Failed to fetch leave types:', error);
        return { success: false, error: 'Failed to fetch leave types' };
    }
}

// ... create/approve/reject functions remain mostly same but ensure no weird returns ...

export async function createLeaveRequest(formData: FormData) {
    const employeeId = formData.get('employeeId') as string;
    const leaveTypeId = formData.get('leaveTypeId') as string;
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const reason = formData.get('reason') as string;

    // Calculate days (simple difference for now)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const daysRequested = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    try {
        // Fetch employee to get manager
        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            select: { managerId: true }
        });

        await prisma.leaveRequest.create({
            data: {
                employeeId,
                leaveTypeId,
                startDate,
                endDate,
                daysRequested,
                reason,
                status: 'PENDING',
                managerApprovalStatus: 'PENDING',
                hrApprovalStatus: 'PENDING',
                lineManagerId: employee?.managerId,
            },
        });

        revalidatePath('/leave');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create leave request:', error);
        return { success: false, error: error.message || 'Failed to create leave request' };
    }
}

export async function approveLeaveRequestManager(id: string, comment: string) {
    try {
        await prisma.leaveRequest.update({
            where: { id },
            data: {
                managerApprovalStatus: 'APPROVED',
                managerComment: comment,
            },
        });
        revalidatePath('/leave');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to approve at manager level' };
    }
}

export async function approveLeaveRequestHR(id: string, comment: string, hrRepId: string) {
    try {
        const request = await prisma.leaveRequest.findUnique({
            where: { id },
            include: { leaveType: true }
        });

        if (!request) return { success: false, error: 'Request not found' };
        if (request.managerApprovalStatus !== 'APPROVED') {
            return { success: false, error: 'Manager approval required first' };
        }

        // Finalize approval
        await prisma.$transaction([
            prisma.leaveRequest.update({
                where: { id },
                data: {
                    hrApprovalStatus: 'APPROVED',
                    hrComment: comment,
                    hrRepId,
                    status: 'APPROVED',
                },
            }),
            // Deduct from balance
            prisma.leaveBalance.update({
                where: {
                    employeeId_leaveTypeId_year: {
                        employeeId: request.employeeId,
                        leaveTypeId: request.leaveTypeId,
                        year: request.startDate.getFullYear(),
                    }
                },
                data: {
                    daysUsed: { increment: request.daysRequested }
                }
            })
        ]);

        revalidatePath('/leave');
        return { success: true };
    } catch (error) {
        console.error('Final approval error:', error);
        return { success: false, error: 'Failed to finalize leave approval' };
    }
}

export async function rejectLeaveRequest(id: string, comment: string, role: 'MANAGER' | 'HR') {
    try {
        await prisma.leaveRequest.update({
            where: { id },
            data: {
                status: 'REJECTED',
                managerApprovalStatus: role === 'MANAGER' ? 'REJECTED' : undefined,
                hrApprovalStatus: role === 'HR' ? 'REJECTED' : undefined,
                managerComment: role === 'MANAGER' ? comment : undefined,
                hrComment: role === 'HR' ? comment : undefined,
            },
        });
        revalidatePath('/leave');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to reject leave request' };
    }
}

export async function getLeaveRequests(filters?: { employeeId?: string, managerId?: string, isHR?: boolean }) {
    try {
        const where: any = {};
        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.managerId) where.lineManagerId = filters.managerId;
        // HR sees everything or specific ones if isHR is true but no other filters

        const requests = await prisma.leaveRequest.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                employee: true,
                leaveType: true,
            },
        });
        // Serialize Dates to avoid "Only plain objects can be passed to Client Components"
        return { success: true, data: serialize(requests) };
    } catch (error) {
        console.error('Failed to fetch leave requests:', error);
        return { success: false, error: 'Failed to fetch leave requests' };
    }
}
