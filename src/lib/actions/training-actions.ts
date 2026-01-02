'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTrainingCourse(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const deliveryMethod = formData.get('deliveryMethod') as string;
    const duration = formData.get('duration') as string;
    // const level = formData.get('level') as string; // Note: 'level' isn't in TrainingCourse model, might need to rely on description or Skills relations. 
    // However, the mocked component used 'level'. I'll skip it for now or store it in description if needed, or add it to schema if the user really wants it. 
    // For now, I'll stick to the model: title, description, category, deliveryMethod, duration, costPerParticipant, contentUrl
    const contentUrl = formData.get('contentUrl') as string;

    if (!title || !description || !category || !deliveryMethod) {
        throw new Error('Missing required fields');
    }

    try {
        await prisma.trainingCourse.create({
            data: {
                title,
                description,
                category,
                deliveryMethod,
                duration: duration || null,
                contentUrl: contentUrl || null,
                costPerParticipant: 0, // Default for now
                // We're not handling skills logic yet for simplicity in this step
            }
        });
    } catch (error) {
        console.error('Error creating training course:', error);
        throw new Error('Failed to create training course');
    }

    revalidatePath('/training');
    redirect('/training');
}

export async function getTrainingCourses() {
    try {
        const courses = await prisma.trainingCourse.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return courses;
    } catch (error) {
        console.error('Error fetching training courses:', error);
        return [];
    }
}
