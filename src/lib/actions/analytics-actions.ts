'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { differenceInYears, parseISO } from 'date-fns';

export async function getWorkforceStats() {
    const session = await auth();
    if (!session?.user) return null;

    // Fetch all active employees
    const employees = await prisma.employee.findMany({
        where: { status: 'ACTIVE' },
        select: {
            id: true,
            gender: true,
            dateJoined: true,
            department: {
                select: { name: true, code: true }
            }
        }
    });

    // 1. Gender Distribution
    const genderMap = new Map<string, number>();
    employees.forEach(emp => {
        const g = emp.gender || 'Unknown';
        genderMap.set(g, (genderMap.get(g) || 0) + 1);
    });
    const genderData = Array.from(genderMap.entries()).map(([name, value]) => ({ name, value }));

    // 2. Department Distribution
    const deptMap = new Map<string, number>();
    employees.forEach(emp => {
        const d = emp.department?.name || 'Unassigned';
        deptMap.set(d, (deptMap.get(d) || 0) + 1);
    });
    const deptData = Array.from(deptMap.entries()).map(([name, value]) => ({ name, value }));

    // 3. Tenure Distribution
    const tenureMap = {
        '< 1 Year': 0,
        '1-3 Years': 0,
        '3-5 Years': 0,
        '5+ Years': 0
    };

    const now = new Date();
    employees.forEach(emp => {
        const years = differenceInYears(now, new Date(emp.dateJoined));
        if (years < 1) tenureMap['< 1 Year']++;
        else if (years < 3) tenureMap['1-3 Years']++;
        else if (years < 5) tenureMap['3-5 Years']++;
        else tenureMap['5+ Years']++;
    });
    const tenureData = Object.entries(tenureMap).map(([name, value]) => ({ name, value }));

    return {
        totalHeadcount: employees.length,
        genderData,
        deptData,
        tenureData
    };
}
