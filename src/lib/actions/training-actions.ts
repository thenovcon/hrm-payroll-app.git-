'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// --- SKILLS ---

export async function getSkills() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: skills };
    } catch (error) {
        return { success: false, error: 'Failed to fetch skills' };
    }
}

export async function createSkill(data: any) {
    try {
        const skill = await prisma.skill.create({ data });
        revalidatePath('/training');
        return { success: true, data: skill };
    } catch (error) {
        return { success: false, error: 'Failed to create skill' };
    }
}

// --- COURSES ---

export async function getCourses() {
    try {
        const courses = await prisma.trainingCourse.findMany({
            include: { skills: true },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: courses };
    } catch (error) {
        return { success: false, error: 'Failed to fetch courses' };
    }
}

export async function createCourse(data: any) {
    try {
        const { skillIds, ...courseData } = data;
        const course = await prisma.trainingCourse.create({
            data: {
                ...courseData,
                skills: {
                    connect: skillIds?.map((id: string) => ({ id })) || []
                }
            }
        });
        revalidatePath('/training');
        return { success: true, data: course };
    } catch (error) {
        return { success: false, error: 'Failed to create course' };
    }
}

// --- ENROLLMENTS ---

export async function enrollEmployee(data: { employeeId: string; courseId: string; assignedBy?: string; deadline?: Date }) {
    try {
        const enrollment = await prisma.enrollment.create({
            data: {
                ...data,
                status: 'ENROLLED',
                progress: 0
            }
        });
        revalidatePath('/training');
        return { success: true, data: enrollment };
    } catch (error) {
        return { success: false, error: 'Failed to enroll employee' };
    }
}

export async function updateEnrollmentProgress(id: string, progress: number, status?: string) {
    try {
        const enrollment = await prisma.enrollment.update({
            where: { id },
            data: {
                progress,
                status: status || (progress === 100 ? 'COMPLETED' : 'IN_PROGRESS'),
                completionDate: progress === 100 ? new Date() : undefined
            }
        });
        revalidatePath('/training');
        return { success: true, data: enrollment };
    } catch (error) {
        return { success: false, error: 'Failed to update progress' };
    }
}

// --- CERTIFICATIONS ---

export async function getCertifications() {
    try {
        const certs = await prisma.certification.findMany({
            include: { employee: true, course: true },
            orderBy: { issueDate: 'desc' }
        });
        return { success: true, data: certs };
    } catch (error) {
        return { success: false, error: 'Failed to fetch certifications' };
    }
}
