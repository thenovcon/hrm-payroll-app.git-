'use server';

import { prisma } from '@/lib/db/prisma';
import bcrypt from 'bcryptjs';

/**
 * Demo Seed Script
 * Populates the database with a realistic organizational structure
 * for demonstration purposes.
 */

export async function seedDemoData() {
    try {
        // 0. Clear existing data
        await prisma.user.deleteMany({});
        await prisma.employee.deleteMany({});
        await prisma.department.deleteMany({});

        // 1. Create Departments
        const hrDept = await prisma.department.create({
            data: {
                name: 'Human Resources',
                code: 'HR',
                description: 'Manages employee relations and benefits'
            }
        });

        const itDept = await prisma.department.create({
            data: {
                name: 'Information Technology',
                code: 'IT',
                description: 'Technology infrastructure and support'
            }
        });

        const salesDept = await prisma.department.create({
            data: {
                name: 'Sales & Marketing',
                code: 'SALES',
                description: 'Revenue generation and customer acquisition'
            }
        });

        const financeDept = await prisma.department.create({
            data: {
                name: 'Finance & Accounting',
                code: 'FIN',
                description: 'Financial planning and reporting'
            }
        });

        // 2. Create Department Heads
        const hrHead = await prisma.employee.create({
            data: {
                firstName: 'Sarah',
                lastName: 'Johnson',
                dateOfBirth: new Date('1985-03-15'),
                gender: 'Female',
                email: 'sarah.johnson@company.com',
                phone: '+233244123456',
                employeeId: 'EMP001',
                position: 'HR Director',
                departmentId: hrDept.id,
                dateJoined: new Date('2020-01-15'),
                employmentType: 'Permanent',
                status: 'ACTIVE'
            }
        });

        const itHead = await prisma.employee.create({
            data: {
                firstName: 'Michael',
                lastName: 'Chen',
                dateOfBirth: new Date('1982-07-22'),
                gender: 'Male',
                email: 'michael.chen@company.com',
                phone: '+233244234567',
                employeeId: 'EMP002',
                position: 'IT Director',
                departmentId: itDept.id,
                dateJoined: new Date('2019-06-01'),
                employmentType: 'Permanent',
                status: 'ACTIVE'
            }
        });

        const salesHead = await prisma.employee.create({
            data: {
                firstName: 'Jennifer',
                lastName: 'Williams',
                dateOfBirth: new Date('1988-11-30'),
                gender: 'Female',
                email: 'jennifer.williams@company.com',
                phone: '+233244345678',
                employeeId: 'EMP003',
                position: 'Sales Director',
                departmentId: salesDept.id,
                dateJoined: new Date('2021-03-10'),
                employmentType: 'Permanent',
                status: 'ACTIVE'
            }
        });

        // 3. Update Departments with Heads
        await prisma.department.update({
            where: { id: hrDept.id },
            data: { headId: hrHead.id }
        });

        await prisma.department.update({
            where: { id: itDept.id },
            data: { headId: itHead.id }
        });

        await prisma.department.update({
            where: { id: salesDept.id },
            data: { headId: salesHead.id }
        });

        // 4. Create Supervisors/Managers
        const hrManager = await prisma.employee.create({
            data: {
                firstName: 'David',
                lastName: 'Brown',
                dateOfBirth: new Date('1990-05-12'),
                gender: 'Male',
                email: 'david.brown@company.com',
                phone: '+233244456789',
                employeeId: 'EMP004',
                position: 'HR Manager',
                departmentId: hrDept.id,
                managerId: hrHead.id,
                dateJoined: new Date('2021-08-01'),
                employmentType: 'Permanent',
                status: 'ACTIVE'
            }
        });

        const itSupervisor = await prisma.employee.create({
            data: {
                firstName: 'Alex',
                lastName: 'Martinez',
                dateOfBirth: new Date('1992-09-18'),
                gender: 'Male',
                email: 'alex.martinez@company.com',
                phone: '+233244567890',
                employeeId: 'EMP005',
                position: 'IT Supervisor',
                departmentId: itDept.id,
                managerId: itHead.id,
                dateJoined: new Date('2022-01-15'),
                employmentType: 'Permanent',
                status: 'ACTIVE'
            }
        });

        const salesSupervisor = await prisma.employee.create({
            data: {
                firstName: 'Emily',
                lastName: 'Davis',
                dateOfBirth: new Date('1993-02-25'),
                gender: 'Female',
                email: 'emily.davis@company.com',
                phone: '+233244678901',
                employeeId: 'EMP006',
                position: 'Sales Team Lead',
                departmentId: salesDept.id,
                managerId: salesHead.id,
                dateJoined: new Date('2022-04-01'),
                employmentType: 'Permanent',
                status: 'ACTIVE'
            }
        });

        // 5. Create Agents (Regular Employees)
        const agents = [
            {
                firstName: 'James',
                lastName: 'Wilson',
                dateOfBirth: new Date('1995-06-10'),
                gender: 'Male',
                email: 'james.wilson@company.com',
                phone: '+233244789012',
                employeeId: 'EMP007',
                position: 'HR Specialist',
                departmentId: hrDept.id,
                managerId: hrManager.id,
                dateJoined: new Date('2023-01-10'),
                employmentType: 'Permanent'
            },
            {
                firstName: 'Sophia',
                lastName: 'Taylor',
                dateOfBirth: new Date('1996-08-14'),
                gender: 'Female',
                email: 'sophia.taylor@company.com',
                phone: '+233244890123',
                employeeId: 'EMP008',
                position: 'Software Developer',
                departmentId: itDept.id,
                managerId: itSupervisor.id,
                dateJoined: new Date('2023-02-15'),
                employmentType: 'Permanent'
            },
            {
                firstName: 'Daniel',
                lastName: 'Anderson',
                dateOfBirth: new Date('1994-12-20'),
                gender: 'Male',
                email: 'daniel.anderson@company.com',
                phone: '+233244901234',
                employeeId: 'EMP009',
                position: 'Sales Representative',
                departmentId: salesDept.id,
                managerId: salesSupervisor.id,
                dateJoined: new Date('2023-03-01'),
                employmentType: 'Permanent'
            },
            {
                firstName: 'Olivia',
                lastName: 'Thomas',
                dateOfBirth: new Date('1997-04-05'),
                gender: 'Female',
                email: 'olivia.thomas@company.com',
                phone: '+233245012345',
                employeeId: 'EMP010',
                position: 'Sales Representative',
                departmentId: salesDept.id,
                managerId: salesSupervisor.id,
                dateJoined: new Date('2023-05-10'),
                employmentType: 'Contract'
            }
        ];

        for (const agent of agents) {
            await prisma.employee.create({ data: { ...agent, status: 'ACTIVE' } });
        }

        // 6. Create User Accounts
        const hashedPassword = await bcrypt.hash('demo123', 10);

        // Admin user
        await prisma.user.create({
            data: {
                username: 'admin',
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE'
            }
        });

        // Department Head users
        await prisma.user.create({
            data: {
                username: 'sarah.johnson',
                password: hashedPassword,
                role: 'HR',
                employeeId: hrHead.id,
                status: 'ACTIVE'
            }
        });

        // Agent user
        await prisma.user.create({
            data: {
                username: 'james.wilson',
                password: hashedPassword,
                role: 'EMPLOYEE',
                employeeId: (await prisma.employee.findFirst({ where: { employeeId: 'EMP007' } }))?.id,
                status: 'ACTIVE'
            }
        });

        return { success: true, message: 'Demo data seeded successfully!' };
    } catch (error) {
        console.error('Seed error:', error);
        return { success: false, error: 'Failed to seed demo data' };
    }
}
