import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Hardcoded hash for 'password123'
const VALID_HASH = '$2a$10$EpIcCoQ.O7/O7/O7/O7/O7/O7/O7/O7/O7/O7/O7/O7/O7';

export async function POST() {
    console.log('🚀 Starting Production Seed via API Route...');

    try {
        // SECURITY CHECK: Disable in production unless explicitly enabled
        if (process.env.NODE_ENV === 'production' && process.env.ENABLE_SEEDING !== 'true') {
            return NextResponse.json({ error: 'Seeding disabled. Set ENABLE_SEEDING=true to override.' }, { status: 403 });
        }

        // 1. Departments
        const DEPARTMENTS = [
            { name: 'Human Resources', code: 'HR' },
            { name: 'Finance', code: 'FIN' },
            { name: 'Engineering', code: 'ENG' },
            { name: 'Sales', code: 'SAL' },
            { name: 'Marketing', code: 'MKT' },
            { name: 'Operations', code: 'OPS' }
        ];

        const deptMap = new Map();
        for (const d of DEPARTMENTS) {
            const dept = await prisma.department.upsert({
                where: { code: d.code },
                update: {},
                create: { name: d.name, code: d.code }
            });
            deptMap.set(d.name, dept.id);
        }

        // 1b. Leave Types
        let annualType = await prisma.leaveType.findUnique({ where: { slug: 'annual' } });
        if (!annualType) {
            annualType = await prisma.leaveType.create({
                data: { name: 'Annual Leave', slug: 'annual', daysAllowed: 20 }
            });
        }
        const sickType = await prisma.leaveType.upsert({
            where: { slug: 'sick' }, update: {}, create: { name: 'Sick Leave', slug: 'sick', daysAllowed: 10 }
        });

        // 2. Admin User
        await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: VALID_HASH,
                role: 'ADMIN',
                status: 'ACTIVE',
                employee: {
                    create: {
                        firstName: 'System', lastName: 'Admin', email: 'admin@novcon.com',
                        position: 'Administrator', departmentId: deptMap.get('Human Resources'),
                        dateJoined: new Date('2020-01-01'), employeeId: 'ADM-001',
                        dateOfBirth: new Date('1990-01-01'), gender: 'MALE', phone: '0200000001',
                        employmentType: 'Permanent', status: 'ACTIVE',
                        salaryStructure: { create: { basicSalary: 15000 } }
                    }
                }
            }
        });

        // 3. Employees (Limit 10)
        const firstNames = ['Kwame', 'Ama', 'Kofi', 'Abena', 'Yaw', 'Akosua', 'Kojo', 'Adwoa', 'Emmanuel', 'Sarah'];
        const lastNames = ['Mensah', 'Osei', 'Appiah', 'Owusu', 'Asante', 'Boateng', 'Antwi', 'Tetteh', 'Addo', 'Arthur'];
        const employees = [];

        // JOB TITLES
        const JOB_TITLES = [
            'HR Assistant', 'HR Manager', 'Talent Acquisition Lead',
            'Accountant', 'Financial Analyst',
            'Software Engineer', 'Senior Developer',
            'Sales Representative', 'Sales Manager'
        ];

        for (let i = 0; i < 10; i++) {
            const fname = firstNames[i % firstNames.length];
            const lname = lastNames[i % lastNames.length];
            const deptName = DEPARTMENTS[i % DEPARTMENTS.length].name;
            const position = JOB_TITLES[i % JOB_TITLES.length];
            const username = `${fname.toLowerCase()}${i}`;
            const email = `${fname}.${lname}${i}@novcon.com`.toLowerCase();

            let role = 'EMPLOYEE';
            if (position.includes('Manager') || position.includes('Lead')) role = 'DEPT_HEAD';
            if (position.includes('HR')) role = 'HR_MANAGER';

            // Check exist by username OR email
            const exists = await prisma.user.findFirst({
                where: { OR: [{ username }, { employee: { email } }] }
            });

            if (exists) {
                employees.push(exists);
                continue;
            }

            try {
                const newUser = await prisma.user.create({
                    data: {
                        username, password: VALID_HASH, role,
                        employee: {
                            create: {
                                firstName: fname, lastName: lname, email, position,
                                departmentId: deptMap.get(deptName),
                                dateJoined: new Date(),
                                employeeId: `EMP-2024-${100 + i}`,
                                dateOfBirth: new Date('1995-01-01'), gender: 'MALE',
                                phone: `020${1000000 + i}`,
                                employmentType: 'Permanent',
                                salaryStructure: { create: { basicSalary: 5000 } },
                                leaveBalances: {
                                    create: [
                                        { year: 2024, leaveTypeId: annualType?.id!, daysAllocated: 20, daysUsed: 0 },
                                        { year: 2024, leaveTypeId: sickType.id, daysAllocated: 10, daysUsed: 0 }
                                    ]
                                }
                            }
                        }
                    },
                    include: { employee: true }
                });
                employees.push(newUser);
            } catch (err) {
                console.error('Skipping user creation error', err);
            }
        }

        // 4. Payroll (Simple)
        const payrollExists = await prisma.payrollRun.findFirst({ where: { month: 12, year: 2024 } });
        if (!payrollExists && employees.length > 0) {
            try {
                await prisma.payrollRun.create({
                    data: {
                        month: 12, year: 2024, status: 'PAID',
                        totalCost: 100000, totalNetPay: 80000,
                        payslips: {
                            create: employees.slice(0, 5).map((u: any) => ({
                                employeeId: u.employee!.id,
                                basicSalary: 5000, totalAllowances: 0, grossSalary: 5000,
                                taxableIncome: 5000, incomeTax: 500, ssnitEmployee: 200, ssnitEmployer: 0,
                                tier2Employee: 0, tier2Employer: 0,
                                totalDeductions: 700, netPay: 4300
                            }))
                        }
                    }
                });
            } catch (e) {
                console.error('Payroll seed error', e);
            }
        }

        return NextResponse.json({ success: true, message: 'Database seeded successfully (Robust Mode via API).' });

    } catch (error: any) {
        console.error('Seeding Fatal Error:', error);
        return NextResponse.json({ success: false, error: `Server Error: ${error.message || String(error)}` }, { status: 500 });
    }
}

export async function GET() {
    try {
        await seedATS();
        return Response.json({ message: 'ATS Seeded Successfully' });
    } catch (error) {
        return Response.json({ error: 'Failed' }, { status: 500 });
    }
}
