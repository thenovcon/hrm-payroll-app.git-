'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

async function getDepartmentContext() {
    const session = await auth();
    const userRole = session?.user?.role;
    const deptId = session?.user?.departmentId;

    if (userRole !== 'DEPT_HEAD' && userRole !== 'ADMIN') {
        throw new Error('Unauthorized: Requires Department Head role');
    }

    if (!deptId && userRole === 'DEPT_HEAD') {
        throw new Error('Configuration Error: Your user account is not linked to a Department.');
    }

    return { deptId };
}

export async function getTeamOverview() {
    const { deptId } = await getDepartmentContext();

    if (!deptId) return { employees: [], stats: {} }; // Admin case handling or safeguard

    const employees = await prisma.employee.findMany({
        where: { departmentId: deptId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            position: true,
            status: true,
            dateJoined: true,
            email: true,
        },
        orderBy: { lastName: 'asc' }
    });

    const totalCount = employees.length;
    const activeCount = employees.filter(e => e.status === 'ACTIVE').length;
    const leaveCount = employees.filter(e => e.status === 'LEAVE').length;

    return {
        employees,
        stats: {
            total: totalCount,
            active: activeCount,
            onLeave: leaveCount
        }
    };
}

export async function getPendingLeaves() {
    const { deptId } = await getDepartmentContext();
    if (!deptId) return [];

    return await prisma.leaveRequest.findMany({
        where: {
            employee: { departmentId: deptId },
            status: 'PENDING'
        },
        include: {
            employee: { select: { firstName: true, lastName: true } }
        },
        orderBy: { startDate: 'asc' }
    });
}

export async function getDeptGoals() {
    const { deptId } = await getDepartmentContext();
    if (!deptId) return [];

    return await prisma.performanceGoal.findMany({
        where: {
            departmentId: deptId,
            level: 'EMPLOYEE'
        },
        include: {
            employee: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function getDeptVacancies() {
    const { deptId } = await getDepartmentContext();
    if (!deptId) return [];

    return await prisma.jobPosting.findMany({
        where: { departmentId: deptId },
        include: {
            _count: { select: { applications: true } }
        }
    });
}
