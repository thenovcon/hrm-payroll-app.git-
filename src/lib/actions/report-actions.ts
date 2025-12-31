'use server';

import { prisma } from '@/lib/db/prisma';

// --- EXECUTIVE DASHBOARD ---

export async function getExecutiveStats() {
    try {
        const activeEmployees = await prisma.employee.count({ where: { status: 'ACTIVE' } });
        const totalHeadcount = await prisma.employee.count();

        // Net change (last 30 days)
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        const newHires = await prisma.employee.count({ where: { createdAt: { gte: lastMonth } } });

        // Payroll Snapshot
        const latestRoll = await prisma.payrollRun.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        // Attendance stats (today)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const presentToday = await prisma.attendanceRecord.count({
            where: { date: today, status: 'PRESENT' }
        });

        return {
            success: true,
            data: {
                headcount: { total: totalHeadcount, active: activeEmployees, newHires },
                payroll: { totalCost: latestRoll?.totalCost || 0, netPay: latestRoll?.totalNetPay || 0 },
                attendance: { presentToday }
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch executive stats' };
    }
}

// --- HR ANALYTICS ---

export async function getHRAnalytics() {
    try {
        // Headcount by department
        const employees = await prisma.employee.findMany({
            select: { department: { select: { name: true } } }
        });

        const deptStats: Record<string, number> = {};
        employees.forEach(e => {
            const deptName = e.department?.name || 'Unassigned';
            deptStats[deptName] = (deptStats[deptName] || 0) + 1;
        });

        // Gender distribution
        const genderStats = await prisma.employee.groupBy({
            by: ['gender'],
            _count: true
        });

        return {
            success: true,
            data: {
                departments: Object.entries(deptStats).map(([name, count]) => ({ name, count })),
                gender: genderStats.map(g => ({ name: g.gender, count: g._count }))
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch HR analytics' };
    }
}

// --- PAYROLL ANALYTICS ---

export async function getPayrollAnalytics() {
    try {
        const payrolls = await prisma.payrollRun.findMany({
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            take: 6
        });

        return {
            success: true,
            data: {
                history: payrolls.reverse()
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch payroll analytics' };
    }
}
