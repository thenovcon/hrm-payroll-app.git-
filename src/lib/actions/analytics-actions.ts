'use server';

import { prisma } from '@/lib/db/prisma';

export async function getRawSalaries() {
    try {
        const salaries = await prisma.salaryStructure.findMany({
            select: { basicSalary: true },
            where: { employee: { status: 'ACTIVE' } }
        });
        return salaries.map(s => s.basicSalary);
    } catch (error) {
        return [];
    }
}

export async function getDepartmentalGrowth() {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                createdAt: true,
                department: { select: { name: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by Month-Year and Department
        const growthMap = new Map<string, Record<string, number>>();
        const depts = new Set<string>();

        employees.forEach(emp => {
            const date = new Date(emp.createdAt);
            const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            const deptName = emp.department?.name || 'Unassigned';
            depts.add(deptName);

            if (!growthMap.has(key)) {
                growthMap.set(key, {});
            }
            const entry = growthMap.get(key)!;
            entry[deptName] = (entry[deptName] || 0) + 1;
        });

        // Convert to cumulative series
        const result = [];
        const runningTotals: Record<string, number> = {};

        // Initialize running totals
        depts.forEach(d => runningTotals[d] = 0);

        for (const [month, counts] of growthMap.entries()) {
            const row: any = { month };
            depts.forEach(d => {
                runningTotals[d] += (counts[d] || 0);
                row[d] = runningTotals[d];
            });
            result.push(row);
        }

        // Return only last 12 months if too large, or all if reasonable
        // Sort by date manually if needed, but Map insertion order is usually chronological if input is sorted by createdAt
        // However, map keys are "Short Month Year", which might not be strictly ordered if crossing years in wrong way?
        // But input is sorted by createdAt asc, so Map entries will be created in chronological order.
        return result.slice(-12);

    } catch (error) {
        console.error("Error fetching growth data", error);
        return [];
    }
}

export async function getHeadcountByDept() {
    try {
        const result = await prisma.employee.groupBy({
            by: ['departmentId'],
            _count: {
                id: true
            },
            where: {
                status: 'ACTIVE'
            }
        });

        const departments = await prisma.department.findMany({
            select: { id: true, name: true }
        });

        const deptMap = new Map(departments.map(d => [d.id, d.name]));

        const mapped = result.map(item => ({
            name: deptMap.get(item.departmentId || '') || 'Unknown',
            value: item._count.id
        })).sort((a, b) => b.value - a.value);

        return mapped;
    } catch (error) {
        console.error('Error fetching headcount:', error);
        return [];
    }
}

export async function getSalaryDistribution() {
    try {
        const salaries = await prisma.salaryStructure.findMany({
            select: { basicSalary: true },
            where: {
                employee: { status: 'ACTIVE' }
            }
        });

        const values = salaries.map(s => s.basicSalary);
        if (values.length === 0) return [];

        const min = Math.min(...values);
        const max = Math.max(...values);
        const bucketSize = (max - min) / 10 || 1000;

        const buckets = Array.from({ length: 11 }, (_, i) => ({
            range: `${Math.floor(min + i * bucketSize / 1000)}k - ${Math.floor(min + (i + 1) * bucketSize / 1000)}k`,
            count: 0,
            avg: Math.floor(min + i * bucketSize)
        }));

        values.forEach(v => {
            const bucketIndex = Math.min(Math.floor((v - min) / bucketSize), 10);
            buckets[bucketIndex].count++;
        });

        return buckets.filter(b => b.count > 0);
    } catch (error) {
        console.error('Error fetching salary distribution:', error);
        return [];
    }
}

export async function getPayrollTrends() {
    try {
        const runs = await prisma.payrollRun.findMany({
            take: 6,
            where: { status: { in: ['PAID', 'APPROVED'] } },
            select: {
                month: true,
                year: true,
                totalCost: true,
                totalNetPay: true
            }
        });

        // Sort chronologically
        runs.sort((a, b) => (a.year - b.year) * 12 + (a.month - b.month));
        // Take last 6
        const last6 = runs.slice(-6);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        return last6.map(r => ({
            name: `${monthNames[r.month - 1]} ${r.year}`,
            Cost: r.totalCost,
            Net: r.totalNetPay
        }));
    } catch (error) {
        console.error('Error fetching payroll trends:', error);
        return [];
    }
}

export async function getDemographics() {
    try {
        const gender = await prisma.employee.groupBy({
            by: ['gender'],
            _count: { id: true },
            where: { status: 'ACTIVE' }
        });

        return gender.map(g => ({
            name: g.gender,
            value: g._count.id
        }));
    } catch (error) {
        return [];
    }
}

// RESTORED: For Legacy Page Compatibility
export async function getWorkforceStats() {
    try {
        const [totalHeadcount, deptData, genderData] = await Promise.all([
            prisma.employee.count({ where: { status: 'ACTIVE' } }),
            getHeadcountByDept(),
            getDemographics()
        ]);

        return {
            totalHeadcount,
            genderData,
            deptData,
            tenureData: [] // Placeholder
        };
    } catch (error) {
        return null; // Return null on error as per page.tsx expectation
    }
}
