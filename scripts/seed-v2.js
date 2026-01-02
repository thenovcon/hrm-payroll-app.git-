const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🌱 Starting V2 Seed...');

        // 1. Create System Admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: adminPassword,
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        });
        console.log('✅ Admin created: admin / admin123');

        // 2. Create Departments
        const hrDept = await prisma.department.upsert({
            where: { code: 'HR' },
            update: {},
            create: { name: 'Human Resources', code: 'HR', description: 'People Ops' }
        });

        const itDept = await prisma.department.upsert({
            where: { code: 'IT' },
            update: {},
            create: { name: 'Information Technology', code: 'IT', description: 'Tech Support & Dev' }
        });

        const financeDept = await prisma.department.upsert({
            where: { code: 'FIN' },
            update: {},
            create: { name: 'Finance', code: 'FIN', description: 'Payroll & Accounts' }
        });
        console.log('✅ Departments created: HR, IT, FIN');

        // 3. Create HR Manager
        await createEmployeeUser({
            username: 'hr_manager',
            firstName: 'Sarah', lastName: 'Mensah',
            email: 'sarah.hr@novcon.com',
            role: 'HR_MANAGER',
            deptId: hrDept.id,
            position: 'HR Manager',
            empId: 'EMP-HR-01'
        });

        // 4. Create IT Head
        await createEmployeeUser({
            username: 'it_head',
            firstName: 'Emmanuel', lastName: 'Asare',
            email: 'emmanuel.it@novcon.com',
            role: 'DEPT_HEAD',
            deptId: itDept.id,
            position: 'Head of IT',
            empId: 'EMP-IT-01',
            isHead: true // Will link to Dept keys later if needed, mostly logic based
        });

        // 5. Create Payroll Officer
        await createEmployeeUser({
            username: 'payroll_officer',
            firstName: 'Kojo', lastName: 'Antwi',
            email: 'kojo.fin@novcon.com',
            role: 'PAYROLL_OFFICER',
            deptId: financeDept.id,
            position: 'Payroll Specialist',
            empId: 'EMP-FIN-01'
        });

        // 6. Create Standard Employee (IT)
        await createEmployeeUser({
            username: 'employee',
            firstName: 'Kwame', lastName: 'Dev',
            email: 'kwame@novcon.com',
            role: 'EMPLOYEE',
            deptId: itDept.id,
            position: 'Software Developer',
            empId: 'EMP-IT-02'
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

async function createEmployeeUser({ username, firstName, lastName, email, role, deptId, position, empId, isHead }) {
    const password = await bcrypt.hash('password123', 10);

    // Create Employee
    const emp = await prisma.employee.upsert({
        where: { email },
        update: { departmentId: deptId },
        create: {
            firstName, lastName, email,
            phone: '0200000000',
            gender: 'Male',
            dateOfBirth: new Date('1990-01-01'),
            dateJoined: new Date(),
            employmentType: 'Permanent',
            position,
            employeeId: empId,
            departmentId: deptId,
            status: 'ACTIVE'
        }
    });

    // Create User
    await prisma.user.upsert({
        where: { username },
        update: {
            password,
            role,
            employeeId: emp.id
        },
        create: {
            username,
            password,
            role,
            employeeId: emp.id
        }
    });

    console.log(`✅ User created: ${username} (${role})`);
}

main();
