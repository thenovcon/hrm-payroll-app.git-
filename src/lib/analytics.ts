import { prisma } from '@/lib/db/prisma';

export async function getRecruitmentFunnel(departmentId?: string) {
    // Base where clause for filtering by department if provided (for Head of Dept only)
    const deptFilter = departmentId ? { requisition: { department: departmentId } } : {};

    // 1. Total Applications
    const totalApplied = await prisma.application.count({
        where: {
            jobPosting: {
                ...deptFilter
            }
        }
    });

    // 2. Shortlisted (Screening/Interview)
    const shortlisted = await prisma.application.count({
        where: {
            jobPosting: { ...deptFilter },
            status: { in: ['SCREENING', 'INTERVIEW_SCHEDULED', 'INTERVIEWED'] }
        }
    });

    // 3. Offered
    const offered = await prisma.application.count({
        where: {
            jobPosting: { ...deptFilter },
            status: { in: ['OFFER_EXTENDED', 'OFFER_ACCEPTED'] }
        }
    });

    // 4. Hired
    const hired = await prisma.application.count({
        where: {
            jobPosting: { ...deptFilter },
            status: 'HIRED'
        }
    });

    return [
        { stage: 'Applied', count: totalApplied },
        { stage: 'Shortlisted', count: shortlisted },
        { stage: 'Offered', count: offered },
        { stage: 'Hired', count: hired }
    ];
}

export async function getWorkforceComposition(departmentId?: string) {
    const where = {
        status: 'ACTIVE',
        ...(departmentId ? { departmentId } : {})
    };

    // 1. Gender Distribution
    const byGender = await prisma.employee.groupBy({
        by: ['gender'],
        where,
        _count: { id: true }
    });

    // 2. Department Distribution (Only relevant if viewing ALL, otherwise it's 100% one dept)
    // If departmentId is set, this will just return that one department.
    const byDept = await prisma.employee.groupBy({
        by: ['departmentId'],
        where,
        _count: { id: true }
    });

    // Resolve Department names manually or via separate query if needed, 
    // but groupBy limits relations. We'll stick to basic counts or enrich later.

    // 3. Tenure (Calculated in JS for now as Prisma aggregation on date diff is complex)
    const employees = await prisma.employee.findMany({
        where,
        select: { dateJoined: true }
    });

    const now = new Date();
    const tenureBuckets = {
        '< 1 Year': 0,
        '1-3 Years': 0,
        '3-5 Years': 0,
        '5+ Years': 0
    };

    employees.forEach(emp => {
        const years = (now.getTime() - new Date(emp.dateJoined).getTime()) / (1000 * 60 * 60 * 24 * 365);
        if (years < 1) tenureBuckets['< 1 Year']++;
        else if (years < 3) tenureBuckets['1-3 Years']++;
        else if (years < 5) tenureBuckets['3-5 Years']++;
        else tenureBuckets['5+ Years']++;
    });

    return {
        byGender: byGender.map(g => ({ name: g.gender, value: g._count.id })),
        byTenure: Object.entries(tenureBuckets).map(([key, val]) => ({ name: key, value: val })),
    };
}
