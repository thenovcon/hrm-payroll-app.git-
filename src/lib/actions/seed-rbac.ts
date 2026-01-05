'use server';

import { prisma } from '@/lib/db/prisma';
import { hash } from 'bcryptjs';

export async function seedRBACUsers() {
    try {
        const password = await hash('novcon123', 10);
        const roles = [
            { email: 'hr_manager@novcon.com', username: 'hr_manager', role: 'HR_MANAGER' },
            { email: 'line_manager@novcon.com', username: 'line_manager', role: 'DEPT_HEAD' },
            { email: 'employee@novcon.com', username: 'employee', role: 'EMPLOYEE' }
        ];

        const results = [];

        for (const r of roles) {
            const exists = await prisma.user.findFirst({ where: { username: r.username } });
            if (!exists) {
                // Create dummy employee first
                const emp = await prisma.employee.create({
                    data: {
                        firstName: r.role.replace('_', ' '),
                        lastName: 'User',
                        email: r.email,
                        employeeId: `SEED-${r.role}`,
                        departmentId: null, // Assign manually later
                        status: 'ACTIVE',
                        employmentType: 'Permanent',
                        dateJoined: new Date(),
                        dateOfBirth: new Date('1990-01-01'),
                        gender: 'Male',
                        phone: '000-000-0000',
                        position: r.role
                    }
                });

                const user = await prisma.user.create({
                    data: {
                        username: r.username,
                        email: r.email,
                        password: password,
                        role: r.role,
                        status: 'ACTIVE',
                        employeeId: emp.id
                    }
                });
                results.push(`Created ${r.username}`);
            } else {
                results.push(`Skipped ${r.username} (Exists)`);
            }
        }
        return { success: true, message: results.join(', ') };
    } catch (error: any) {
        console.error("Seeding Error:", error);
        return { success: false, error: error.message };
    }
}
