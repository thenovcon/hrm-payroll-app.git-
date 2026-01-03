'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEmployee(prevState: any, formData: FormData) {
    const data = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        dateOfBirth: new Date(formData.get('dateOfBirth') as string),
        gender: formData.get('gender') as string,
        position: formData.get('position') as string,
        departmentId: formData.get('departmentId') as string || undefined,
        dateJoined: new Date(formData.get('dateJoined') as string),
        employeeId: formData.get('employeeId') as string,
        employmentType: formData.get('employmentType') as string,
        ghanaCardNumber: formData.get('ghanaCardNumber') as string,
        ssnitNumber: formData.get('ssnitNumber') as string,
    };

    try {
        const username = `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}`;
        const tempPassword = `Welcome${new Date().getFullYear()}!`;
        const { hash } = await import('bcryptjs'); // Lazy load
        const hashedPassword = await hash(tempPassword, 10);
        const { sendWelcomeEmail } = await import('@/lib/actions/email-actions');

        // Use transaction to ensure both Employee and User are created
        const result = await prisma.$transaction(async (tx) => {
            const employee = await tx.employee.create({
                data: { ...data }
            });

            // Create User Account
            await tx.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    role: 'EMPLOYEE',
                    employeeId: employee.id,
                    status: 'ACTIVE'
                }
            });

            return employee;
        });

        // Send Email (outside transaction to avoid blocking, though typically handled via queue)
        await sendWelcomeEmail(data.email, data.firstName, username, tempPassword);

    } catch (error) {
        console.error('Failed to create employee:', error);
        return { success: false, error: 'Failed to create employee' };
    }

    revalidatePath('/employees');
    redirect('/employees');
}
