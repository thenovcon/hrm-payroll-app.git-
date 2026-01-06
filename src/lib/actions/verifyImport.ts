
"use server";
import { prisma } from "@/lib/db/prisma";

export async function verifyImportHealth() {
    const totalEmployees = await prisma.employee.count();

    // Find employees missing vital payroll data
    const missingSalary = await prisma.employee.count({
        where: { salaryStructure: { is: null } }
    });

    const missingDept = await prisma.employee.count({
        where: { departmentId: null }
    });

    let duplicates = 0;
    try {
        const dups: any[] = await prisma.$queryRaw`
        SELECT email, COUNT(email) 
        FROM "Employee" 
        GROUP BY email 
        HAVING COUNT(email) > 1
      `;
        duplicates = dups.length;
    } catch (e) {
        console.warn("Duplicate check failed or not supported in this DB mode", e);
    }

    return {
        total: totalEmployees,
        healthy: totalEmployees - (missingSalary + missingDept),
        issues: {
            salary: missingSalary,
            department: missingDept,
            duplicates: duplicates
        }
    };
}
