'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';

export async function getRecruitmentFunnelStats() {
    const session = await auth();
    if (!session?.user) return null;

    // TODO: Add Department filtering logic if user is DEPT_HEAD
    // For now, fetch global stats

    // Group applications by status
    const statusCounts = await prisma.application.groupBy({
        by: ['status'],
        _count: {
            id: true
        }
    });

    // Valid funnel stages order
    const funnelOrder = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

    // Map to clean format
    const funnelData = funnelOrder.map(stage => {
        const found = statusCounts.find(s => s.status === stage);
        return {
            stage,
            count: found?._count.id || 0
        };
    });

    return funnelData;
}

export async function getJobStats() {
    const jobStats = await prisma.jobPosting.groupBy({
        by: ['status'],
        _count: {
            id: true
        }
    });
    return jobStats.map(s => ({ status: s.status, count: s._count.id }));
}
