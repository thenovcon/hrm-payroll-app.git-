
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { chunk } = await req.json();

        // Safe Date Parsing helper
        const safeDate = (d: any) => {
            if (!d) return new Date();
            const date = new Date(d);
            return isNaN(date.getTime()) ? new Date() : date;
        };

        const defaultPassword = await hash('novcon123', 10);

        // Fetch Department Map for quick lookup
        const departments = await prisma.department.findMany({ select: { id: true, name: true, code: true } });
        const deptMap = new Map(departments.map(d => [d.name.toLowerCase(), d.id]));
        const deptCodeMap = departments.reduce((acc, d) => {
            if (d.code) acc.set(d.code.toLowerCase(), d.id);
            return acc;
        }, new Map<string, string>());

        const results = [];
        for (const row of chunk) {
            if (!row.email) continue;

            // Resolve Department
            let departmentId = null;
            if (row.department) {
                const dName = String(row.department).toLowerCase().trim();
                departmentId = deptMap.get(dName) || deptCodeMap.get(dName);
            }

            // Prepare Data
            const basicSalary = parseFloat(row.basicSalary) || 0;
            const empId = row.employeeId || `IMP-${Math.floor(Math.random() * 1000000)}`;

            try {
                // Upsert Employee
                const emp = await prisma.employee.upsert({
                    where: { email: row.email },
                    update: {
                        firstName: row.firstName,
                        lastName: row.lastName,
                        departmentId: departmentId,
                        position: row.position,
                        status: 'ACTIVE',
                    },
                    create: {
                        firstName: row.firstName,
                        lastName: row.lastName,
                        email: row.email,
                        employeeId: empId,
                        dateOfBirth: safeDate('1990-01-01'), // Default
                        dateJoined: safeDate(row.dateJoined),
                        gender: row.gender || 'Unknown',
                        phone: row.phone || '0000000000',
                        position: row.position || 'Staff',
                        employmentType: 'Permanent',
                        status: 'ACTIVE',
                        departmentId: departmentId,
                        salaryStructure: {
                            create: { basicSalary }
                        }
                    }
                });

                // Ensure User Account Exists
                const username = row.email.split('@')[0];
                const existingUser = await prisma.user.findFirst({ where: { OR: [{ username }, { employeeId: emp.id }] } });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            username,
                            password: defaultPassword,
                            role: 'EMPLOYEE',
                            status: 'ACTIVE',
                            employeeId: emp.id
                        }
                    });
                }

                results.push({ success: true });
            } catch (innerError: any) {
                console.error(`Failed to import row for ${row.email}:`, innerError);
                results.push({ success: false, email: row.email, error: innerError.message });
            }
        }

        const successCount = results.filter(r => r.success).length;
        const failedRows = results.filter(r => !r.success);

        return NextResponse.json({
            success: true,
            count: successCount,
            failed: failedRows,
            message: `Processed ${chunk.length} rows. Success: ${successCount}, Failed: ${failedRows.length}`
        });

    } catch (error: any) {
        console.error("API Import Error:", error);
        return NextResponse.json({ success: false, error: 'Database transaction failed: ' + error.message }, { status: 500 });
    }
}
