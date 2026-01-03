
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// --- Constants ---
const DEPARTMENTS = [
    { name: 'Human Resources', code: 'HR' },
    { name: 'Finance', code: 'FIN' },
    { name: 'Engineering', code: 'ENG' },
    { name: 'Sales', code: 'SAL' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Operations', code: 'OPS' }
];

const JOB_TITLES = [
    'HR Assistant', 'HR Manager', 'Talent Acquisition Lead',
    'Accountant', 'Financial Analyst', 'Payroll Officer',
    'Software Engineer', 'Senior Developer', 'IT Support',
    'Sales Representative', 'Sales Manager', 'Business Dev',
    'Marketing Exec', 'Digital Specialist',
    'Operations Manager', 'Facilities Manager'
];

async function main() {
    console.log('🚀 Starting Comprehensive Demo Seed...');

    // 0. Cleanup (Optional: Be careful in prod, but safe for demo env)
    // await prisma.$transaction([prisma.leaveRequest.deleteMany(), ...]);

    const hashedPassword = await hash('password123', 10);

    // 1. Departments
    const deptMap = new Map(); // Name -> ID
    for (const d of DEPARTMENTS) {
        const dept = await prisma.department.upsert({
            where: { code: d.code },
            update: {},
            create: { name: d.name, code: d.code }
        });
        deptMap.set(d.name, dept.id);
    }
    console.log('✅ Departments Synced');

    // 1b. Leave Types (Create Early for Relations)
    let annualType = await prisma.leaveType.findUnique({ where: { slug: 'annual' } });
    if (!annualType) {
        annualType = await prisma.leaveType.create({
            data: { name: 'Annual Leave', slug: 'annual', daysAllowed: 20 }
        });
    }
    const sickType = await prisma.leaveType.upsert({
        where: { slug: 'sick' }, update: {}, create: { name: 'Sick Leave', slug: 'sick', daysAllowed: 10 }
    });
    console.log('✅ Leave Types Synced');

    // 2. Core Users (Ensure Admin & specific roles exist)
    const adminUser = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
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

    // 2b. Create Michael Duodu (Requested Admin)
    const michaelAdmin = await prisma.user.upsert({
        where: { username: 'mduodu' },
        update: {
            role: 'ADMIN',
            password: await hash('admin123', 10) // Ensure password is set
        },
        create: {
            username: 'mduodu',
            password: await hash('admin123', 10),
            role: 'ADMIN',
            status: 'ACTIVE',
            employee: {
                create: {
                    firstName: 'Michael', lastName: 'Duodu', email: 'michael.duodu@novcon.com',
                    position: 'System Administrator', departmentId: deptMap.get('Human Resources'),
                    dateJoined: new Date(), employeeId: 'ADM-002',
                    dateOfBirth: new Date('1990-01-01'), gender: 'MALE', phone: '0500000000',
                    employmentType: 'Permanent', status: 'ACTIVE',
                    salaryStructure: { create: { basicSalary: 18000 } }
                }
            }
        }
    });
    console.log('✅ Admins Synced (System + Michael)');

    // 3. Generate 50 Random Employees for Volume
    const employees = [];
    const firstNames = ['Kwame', 'Ama', 'Kofi', 'Abena', 'Yaw', 'Akosua', 'Kojo', 'Adwoa', 'Emmanuel', 'Sarah'];
    const lastNames = ['Mensah', 'Osei', 'Appiah', 'Owusu', 'Asante', 'Boateng', 'Antwi', 'Tetteh', 'Addo', 'Arthur'];

    for (let i = 0; i < 50; i++) {
        const fname = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lname = lastNames[Math.floor(Math.random() * lastNames.length)];
        const deptName = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)].name;
        const position = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
        const username = `${fname.toLowerCase()}${i}`;
        const email = `${fname}.${lname}${i}@novcon.com`.toLowerCase();

        // Determine Role
        let role = 'EMPLOYEE';
        if (position.includes('Manager') || position.includes('Lead')) role = 'DEPT_HEAD';
        if (position.includes('HR') || position.includes('Talent')) role = 'HR_MANAGER';
        if (position.includes('Payroll') || position.includes('Accountant')) role = 'PAYROLL_OFFICER';

        // Check exist
        const exists = await prisma.user.findUnique({ where: { username } });
        if (exists) {
            employees.push(exists);
            continue;
        }

        const newUser = await prisma.user.create({
            data: {
                username, password: hashedPassword, role,
                employee: {
                    create: {
                        firstName: fname, lastName: lname, email, position,
                        departmentId: deptMap.get(deptName),
                        dateJoined: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 3)),
                        employeeId: `EMP-${2024000 + i}`,
                        dateOfBirth: new Date('1995-05-20'), gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE',
                        phone: `024${Math.floor(Math.random() * 1000000)}`,
                        employmentType: 'Permanent',
                        salaryStructure: { create: { basicSalary: 3000 + Math.random() * 7000 } },
                        // Initialize Leave Balances
                        leaveBalances: {
                            create: [
                                { year: 2024, leaveTypeId: annualType.id, daysAllocated: 20, daysUsed: Math.floor(Math.random() * 10) },
                                { year: 2024, leaveTypeId: sickType.id, daysAllocated: 10, daysUsed: Math.floor(Math.random() * 5) }
                            ]
                        }
                    }
                }
            },
            include: { employee: true }
        });
        employees.push(newUser);
    }
    console.log(`✅ Created/Synced ${employees.length} Employees`);

    // --- 4. ATS Module ---
    console.log('Creating ATS Data...');
    const hrUser = employees.find(u => u.role === 'HR_MANAGER') || employees[0];

    // Create specific Requisition
    const req = await prisma.requisition.create({
        data: {
            reqNumber: 'REQ-2026-001',
            title: 'Senior Software Engineer',
            department: 'Engineering',
            location: 'Accra, Head Office',
            type: 'Full-time',
            priority: 'HIGH',
            status: 'APPROVED',
            jobDescription: 'We are looking for a senior React developer...',
            createdById: hrUser.id,
            jobPosting: {
                create: {
                    title: 'Senior Software Engineer',
                    content: 'Join our dynamic team...',
                    status: 'ACTIVE',
                    publishedAt: new Date()
                }
            }
        }
    });

    // Candidates
    const candidates = [
        { name: 'John Doe', email: 'john.doe@gmail.com' },
        { name: 'Jane Smith', email: 'jane.smith@yahoo.com' },
        { name: 'Michael Brown', email: 'm.brown@outlook.com' }
    ];

    for (const c of candidates) {
        await prisma.candidate.create({
            data: {
                name: c.name, email: c.email,
                applications: {
                    create: {
                        jobPostingId: (await prisma.jobPosting.findFirst())?.id!,
                        status: ['APPLIED', 'SCREENING', 'INTERVIEW'][Math.floor(Math.random() * 3)],
                        interviews: {
                            create: {
                                interviewDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
                                type: 'Technical',
                                status: 'SCHEDULED',
                                interviewerId: employees.find(e => e.role === 'DEPT_HEAD')?.id
                            }
                        }
                    }
                }
            }
        });
    }

    // --- 5. Leave Requests ---
    // Leave Types already created at step 1b
    console.log('Seeding Leave Requests...');
    for (let i = 0; i < 10; i++) {
        const emp = employees[i];
        if (!emp.employee) continue; // Should have employee relation

        await prisma.leaveRequest.create({
            data: {
                employeeId: emp.employee.id,
                leaveTypeId: annualType.id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000 * 3), // 3 days
                daysRequested: 3,
                reason: 'Personal errands',
                status: ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)],
                managerApprovalStatus: 'PENDING',
                hrApprovalStatus: 'PENDING'
            }
        });
    }

    // --- 6. Attendance Records ---
    console.log('Seeding Attendance Records...');
    const today = new Date();
    // Generate for last 5 days for first 10 employees
    for (let d = 0; d < 5; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - d);

        for (let i = 0; i < 10; i++) {
            const emp = employees[i];
            if (!emp.employee) continue;

            await prisma.attendanceRecord.upsert({
                where: { employeeId_date: { employeeId: emp.employee.id, date } },
                update: {},
                create: {
                    employeeId: emp.employee.id,
                    date: date,
                    clockIn: new Date(date.setHours(8, Math.floor(Math.random() * 30), 0)), // 8:00 - 8:30
                    clockOut: new Date(date.setHours(17, Math.floor(Math.random() * 30), 0)), // 17:00 - 17:30
                    status: 'PRESENT',
                    hoursWorked: 8.5
                }
            });
        }
    }

    // --- 7. Payroll ---
    console.log('Seeding Payroll Run...');
    await prisma.payrollRun.upsert({
        where: { month_year: { month: 12, year: 2024 } },
        update: {},
        create: {
            month: 12, year: 2024, status: 'PAID',
            totalCost: 150000, totalNetPay: 120000,
            payslips: {
                create: employees.slice(0, 5).map(u => ({
                    employeeId: u.employee!.id,
                    basicSalary: 5000, totalAllowances: 500, grossSalary: 5500,
                    taxableIncome: 5000, incomeTax: 400, ssnitEmployee: 200, ssnitEmployer: 300,
                    tier2Employee: 100, tier2Employer: 100,
                    totalDeductions: 700, netPay: 4800
                }))
            }
        }
    });

    // --- 8. Performance ---
    console.log('Seeding Goals...');
    const goalEmp = employees[0];
    if (goalEmp.employee) {
        await prisma.performanceGoal.create({
            data: {
                title: 'Deliver Q1 Project',
                description: 'Complete the migration to new HRM system',
                employeeId: goalEmp.employee.id,
                status: 'IN_PROGRESS',
                progress: 65,
                dueDate: new Date(Date.now() + 86400000 * 30),
                weight: 40
            }
        });
    }

    // --- 9. Engagement / Social ---
    console.log('Seeding Social Feed...');
    if (employees.length > 0) {
        await prisma.socialPost.create({
            data: {
                content: '🎉 Thrilled to announce we have hit our Q4 targets! Great job team!',
                authorId: adminUser.id,
                likes: { create: { userId: employees[0].id } },
                comments: { create: { userId: employees[1].id, content: 'Awesome news!' } }
            }
        });

        await prisma.socialPost.create({
            data: {
                content: 'Welcome to our new joiners! Please say hello 👋',
                authorId: hrUser.id,
            }
        });
    }

    console.log('✨ Demo Seed Complete! Ready for Show & Tell.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
