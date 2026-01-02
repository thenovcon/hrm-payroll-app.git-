import { prisma } from '@/lib/db/prisma';

export async function getFinancialMetrics() {
    // Get latest approved or paid payroll run
    const latestRun = await prisma.payrollRun.findFirst({
        where: { status: { in: ['APPROVED', 'PAID'] } },
        orderBy: { createdAt: 'desc' }
    });

    return {
        totalCost: latestRun?.totalCost || 0,
        month: latestRun?.month,
        year: latestRun?.year,
        status: latestRun?.status || 'No Run'
    };
}

export async function getComplianceMetrics() {
    // 1. Pending Attendance Exceptions
    const pendingExceptions = await prisma.attendanceException.count({
        where: { status: 'PENDING' }
    });

    // 2. Pending Leave Requests (Compliance risk if delayed)
    const pendingLeave = await prisma.leaveRequest.count({
        where: { status: 'PENDING' }
    });

    // 3. Expired Documents (Mocked logic until Document model has expiry)
    // For now, let's assume 0 expired docs to avoid false alarms
    const expiredDocs = 0;

    return {
        pendingExceptions,
        pendingLeave,
        expiredDocs,
        totalRisks: pendingExceptions + pendingLeave + expiredDocs
    };
}

export async function getAttritionMetrics() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Resignations/Terminations this month
    const terminations = await prisma.employee.count({
        where: {
            status: { in: ['TERMINATED', 'RESIGNED'] },
            updatedAt: { gte: firstDayOfMonth } // Proxy for termination date if not explicitly tracked
        }
    });

    // New Hires this month
    const hires = await prisma.employee.count({
        where: {
            dateJoined: { gte: firstDayOfMonth }
        }
    });

    return {
        terminations,
        hires,
        netChange: hires - terminations
    };
}
