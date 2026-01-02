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

// --- PERFORMANCE ANALYTICS ---

export async function getGoalStatsByDepartment() {
    try {
        const goals = await prisma.performanceGoal.findMany({
            where: {
                status: 'ACHIEVED',
                departmentId: { not: null } // Only Dept-linked goals
            },
            include: { department: true }
        });

        // Group by department
        const deptCounts: Record<string, number> = {};
        goals.forEach(g => {
            const deptName = g.department?.name || 'Unknown';
            deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
        });

        // Also get total goals per department specifically to calc %
        // For simplicity now, just returning Raw Count of Achieved Goals
        // ideally we want (Achieved / Total) * 100

        const allGoals = await prisma.performanceGoal.findMany({
            where: { departmentId: { not: null } },
            include: { department: true }
        });

        // Map: DeptName -> { total: number, achieved: number }
        const stats: Record<string, { total: number, achieved: number }> = {};

        allGoals.forEach(g => {
            const name = g.department?.name || 'Unknown';
            if (!stats[name]) stats[name] = { total: 0, achieved: 0 };
            stats[name].total++;
            if (g.status === 'ACHIEVED') stats[name].achieved++;
        });

        const chartData = Object.entries(stats).map(([name, val]) => ({
            name,
            completionRate: val.total > 0 ? Math.round((val.achieved / val.total) * 100) : 0,
            totalGoals: val.total
        }));

        return {
            success: true,
            data: chartData
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch goal stats' };
    }
}
