'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createEmployee(formData: FormData) {
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
        const employee = await prisma.employee.create({
            data: {
                ...data,
            },
        });

    } catch (error) {
        console.error('Failed to create employee:', error);
        return { success: false, error: 'Failed to create employee' };
    }

    revalidatePath('/employees');
    redirect('/employees');
}
