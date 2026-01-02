
'use server';

import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';

const firstNames = [
    'Kwame', 'Kofi', 'Ama', 'Akosua', 'Yaw', 'Yaa', 'Kojo', 'Adwoa', 'Kwabena', 'Abena',
    'Kwaku', 'Akua', 'Kwadwo', 'Afia', 'Esi', 'Kweku', 'Efua', 'Akwasi', 'Akos', 'Nana',
    'Samuel', 'Emmanuel', 'Prince', 'Isaac', 'Daniel', 'Joseph', 'Richmond', 'Frank', 'Micheal', 'Seth',
    'Mary', 'Sarah', 'Elizabeth', 'Gifty', 'Comfort', 'Mercy', 'Gloria', 'Joyce', 'Alice', 'Beatrice'
];

const lastNames = [
    'Mensah', 'Osei', 'Appiah', 'Owusu', 'Asante', 'Boateng', 'Antwi', 'Agyapong', 'Frimpong', 'Opoku',
    'Amoah', 'Gyasi', 'Acheampong', 'Obeng', 'Danso', 'Abankwah', 'Sarpong', 'Kyeremeh', 'Tetteh', 'Lartey',
    'Quaye', 'Lamptey', 'Ocquaye', 'Addo', 'Dadzie', 'Arthur', 'Forson', 'Baffour', 'Boakye', 'Konadu'
];

const departments = [
    { name: 'Human Resources', code: 'HR' },
    { name: 'Finance', code: 'FIN' },
    { name: 'Engineering', code: 'ENG' },
    { name: 'Sales', code: 'SAL' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Operations', code: 'OPS' }
];

const positions = ['Associate', 'Senior Associate', 'Manager', 'Director', 'Intern'];

export async function seedGhanaianDemoData() {
    console.log('🌱 Starting Enriched Demo Seed...');

    try {
        const hashedPassword = await hash('password123', 10);

        // 1. Create/Get Departments
        const deptMap = new Map();
        for (const dept of departments) {
            const d = await prisma.department.upsert({
                where: { code: dept.code },
                update: { name: dept.name },
                create: { name: dept.name, code: dept.code },
            });
            deptMap.set(dept.name, d.id);
        }

        // 1b. Create Leave Types if missing
        const leaveTypes = await prisma.leaveType.findMany();
        let annualLeaveId = leaveTypes.find(l => l.slug === 'annual')?.id;

        if (!annualLeaveId) {
            const al = await prisma.leaveType.create({
                data: { name: 'Annual Leave', slug: 'annual', daysAllowed: 20 }
            });
            annualLeaveId = al.id;
            await prisma.leaveType.create({
                data: { name: 'Sick Leave', slug: 'sick', daysAllowed: 10 }
            });
        }

        // 2. Create Admin
        const adminEmail = 'admin@novcon.com';
        const existingAdmin = await prisma.user.findUnique({ where: { username: 'admin' } });

        if (!existingAdmin) {
            await prisma.user.create({
                data: {
                    username: 'admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                    employee: {
                        create: {
                            firstName: 'System',
                            lastName: 'Admin',
                            email: adminEmail,
                            position: 'System Administrator',
                            departmentId: deptMap.get('Human Resources'),
                            dateJoined: new Date('2023-01-01'),
                            status: 'ACTIVE',
                            dateOfBirth: new Date('1990-01-01'),
                            gender: 'MALE',
                            phone: '0200000000',
                            employeeId: 'ADMIN-001',
                            employmentType: 'Permanent',
                            salaryStructure: { create: { basicSalary: 15000, currency: 'GHS' } }
                        }
                    }
                }
            });
        }

        // 3. Generate 50 Employees
        const createdEmployeeIds: string[] = [];

        let count = 0;
        // Check if we already have employees to avoid duplicates if seed runs twice
        const existingCount = await prisma.employee.count();
        const targetCount = 50;
        const needed = targetCount - existingCount;

        if (needed > 0) {
            for (let i = 0; i < needed; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const departmentName = departments[Math.floor(Math.random() * departments.length)].name;
                const position = positions[Math.floor(Math.random() * positions.length)];

                const uniqueNum = existingCount + i + 1;
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueNum}@novcon.com`;
                const username = `${firstName.toLowerCase()}${uniqueNum}`;
                const employeeId = `EMP-${2025000 + uniqueNum}`;

                const exists = await prisma.user.findUnique({ where: { username } });
                if (exists) continue;

                const dateOfBirth = new Date(1970 + Math.floor(Math.random() * 30), 0, 1);
                const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
                const basicSalary = 2500 + Math.floor(Math.random() * 12500); // 2500 - 15000

                const user = await prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword,
                        role: position === 'Director' || position === 'Manager' ? 'DEPT_HEAD' : 'EMPLOYEE',
                        employee: {
                            create: {
                                firstName,
                                lastName,
                                email,
                                position,
                                departmentId: deptMap.get(departmentName),
                                dateJoined: new Date(Date.now() - Math.floor(Math.random() * 63072000000)), // up to 2 years ago
                                status: 'ACTIVE',
                                dateOfBirth,
                                gender,
                                phone: `0${Math.floor(Math.random() * 9)}0${Math.floor(Math.random() * 10000000)}`,
                                employeeId,
                                employmentType: 'Permanent',
                                salaryStructure: {
                                    create: { basicSalary, currency: 'GHS' }
                                }
                            }
                        }
                    },
                    include: { employee: true }
                });

                if (user.employee) createdEmployeeIds.push(user.employee.id);
                count++;
            }
        }

        // --- HISTORICAL DATA ENRICHMENT ---

        // 4. Attendance History (Past 30 days)
        // Only generate if we have employees
        const allEmployees = await prisma.employee.findMany();
        const today = new Date();

        for (const emp of allEmployees) {
            // Generate for last 30 days
            for (let d = 30; d >= 0; d--) {
                const date = new Date(today);
                date.setDate(date.getDate() - d);

                // Skip weekends
                if (date.getDay() === 0 || date.getDay() === 6) continue;

                // Random status
                const rand = Math.random();
                let status = 'PRESENT';
                let clockIn = new Date(date);
                clockIn.setHours(8, 0, 0, 0); // 8 AM
                let clockOut = new Date(date);
                clockOut.setHours(17, 0, 0, 0); // 5 PM

                if (rand > 0.9) status = 'ABSENT';
                else if (rand > 0.8) {
                    status = 'LATE';
                    clockIn.setHours(9, Math.floor(Math.random() * 30), 0);
                }

                if (status !== 'ABSENT') {
                    // Try/Catch unique constraint
                    try {
                        const dateStr = date.toISOString().split('T')[0]; // simple uniqueness check logic usually needs full date object in prisma
                        // We need to verify if record exists first to be safe or use upsert

                        // Note: Prisma date unique constraints can be tricky with ISO times. 
                        // Check if record exists for this day
                        const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
                        const endOfDay = new Date(date); endOfDay.setHours(23, 59, 59, 999);

                        const existing = await prisma.attendanceRecord.findFirst({
                            where: {
                                employeeId: emp.id,
                                date: { gte: startOfDay, lte: endOfDay }
                            }
                        });

                        if (!existing) {
                            await prisma.attendanceRecord.create({
                                data: {
                                    employeeId: emp.id,
                                    date: date,
                                    status,
                                    clockIn: status === 'ABSENT' ? null : clockIn,
                                    clockOut: status === 'ABSENT' ? null : clockOut
                                }
                            });
                        }
                    } catch (e) { /* ignore constraint */ }
                }
            }
        }

        // 5. Payroll History (Last 3 months)
        const currentMonth = today.getMonth(); // 0-11
        const currentYear = today.getFullYear();

        for (let m = 1; m <= 3; m++) {
            let targetMonth = currentMonth - m;
            let targetYear = currentYear;
            if (targetMonth < 0) {
                targetMonth += 12;
                targetYear -= 1;
            }

            // Create Payroll Run if not exists
            let payrollRun = await prisma.payrollRun.findFirst({
                where: { month: targetMonth + 1, year: targetYear }
            });

            if (!payrollRun) {
                payrollRun = await prisma.payrollRun.create({
                    data: {
                        month: targetMonth + 1,
                        year: targetYear,
                        status: 'APPROVED',
                        totalCost: 0,
                        totalNetPay: 0
                    }
                });

                // Generate Payslips for all employees active at that time
                // Simplify: just generate for all current employees
                let runTotalCost = 0;
                let runTotalNet = 0;

                for (const emp of allEmployees) {
                    // Get salary
                    const salaryStruct = await prisma.salaryStructure.findUnique({ where: { employeeId: emp.id } });
                    const basic = salaryStruct?.basicSalary || 2000;

                    // Simple tax math
                    const ssnitEmp = basic * 0.055;
                    const ssnitEr = basic * 0.13;
                    const taxable = basic - ssnitEmp;
                    const tax = taxable * 0.15; // flat dummy tax
                    const net = taxable - tax;

                    await prisma.payslip.create({
                        data: {
                            payrollRunId: payrollRun.id,
                            employeeId: emp.id,
                            basicSalary: basic,
                            totalAllowances: 0,
                            grossSalary: basic,
                            taxableIncome: taxable,
                            incomeTax: tax,
                            ssnitEmployee: ssnitEmp,
                            ssnitEmployer: ssnitEr,
                            tier2Employee: 0,
                            tier2Employer: 0,
                            totalDeductions: tax + ssnitEmp,
                            netPay: net
                        }
                    });

                    runTotalCost += (basic + ssnitEr);
                    runTotalNet += net;
                }

                // Update run totals
                await prisma.payrollRun.update({
                    where: { id: payrollRun.id },
                    data: { totalCost: runTotalCost, totalNetPay: runTotalNet }
                });
            }
        }

        return { success: true, message: `Seeding & Enrichment complete. User Count: ${existingCount + count}` };
    } catch (error) {
        console.error("Seeding failed:", error);
        return { success: false, error: String(error) };
    }
}
