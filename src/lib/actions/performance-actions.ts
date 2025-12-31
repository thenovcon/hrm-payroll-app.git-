'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

// --- PERFORMANCE CYCLE ACTIONS ---

export async function getPerformanceCycles() {
    try {
        const cycles = await prisma.performanceCycle.findMany({
            orderBy: { startDate: 'desc' }
        });
        return { success: true, data: cycles };
    } catch (error) {
        return { success: false, error: 'Failed to fetch performance cycles' };
    }
}

export async function createPerformanceCycle(data: { name: string, type: string, startDate: Date, endDate: Date }) {
    try {
        const cycle = await prisma.performanceCycle.create({
            data: {
                ...data,
                status: 'DRAFT'
            }
        });
        revalidatePath('/performance');
        return { success: true, data: cycle };
    } catch (error) {
        return { success: false, error: 'Failed to create performance cycle' };
    }
}

export async function updateCycleStatus(id: string, status: string) {
    try {
        await prisma.performanceCycle.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/performance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update cycle status' };
    }
}

// --- GOAL ACTIONS ---

export async function getEmployeeGoals(employeeId: string, cycleId: string) {
    try {
        const goals = await prisma.performanceGoal.findMany({
            where: { employeeId, cycleId },
            include: { checkins: true }
        });
        return { success: true, data: goals };
    } catch (error) {
        return { success: false, error: 'Failed to fetch goals' };
    }
}

export async function createPerformanceGoal(data: any) {
    try {
        // Validation: Total weight for the cycle must not exceed 100%
        const existingGoals = await prisma.performanceGoal.findMany({
            where: { employeeId: data.employeeId, cycleId: data.cycleId }
        });
        const currentWeight = existingGoals.reduce((sum: number, g: any) => sum + g.weight, 0);

        if (currentWeight + data.weight > 100) {
            return { success: false, error: `Total weight cannot exceed 100%. Current total: ${currentWeight}%` };
        }

        const goal = await prisma.performanceGoal.create({
            data: {
                ...data,
                status: 'IN_PROGRESS'
            }
        });
        revalidatePath('/performance');
        return { success: true, data: goal };
    } catch (error) {
        return { success: false, error: 'Failed to create goal' };
    }
}

// --- APPRAISAL ACTIONS ---

export async function submitAppraisal(id: string, stage: string, data: any) {
    try {
        const appraisal = await prisma.appraisal.update({
            where: { id },
            data: {
                ...data,
                status: stage
            }
        });
        revalidatePath('/performance');
        return { success: true, data: appraisal };
    } catch (error) {
        return { success: false, error: 'Failed to submit appraisal' };
    }
}

export async function getAppraisals(cycleId: string) {
    try {
        const appraisals = await prisma.appraisal.findMany({
            where: { cycleId },
            include: { employee: true }
        });
        return { success: true, data: appraisals };
    } catch (error) {
        return { success: false, error: 'Failed to fetch appraisals' };
    }
}

// --- FEEDBACK ACTIONS ---

export async function submitFeedback(data: any) {
    try {
        const feedback = await prisma.performanceFeedback.create({
            data
        });
        return { success: true, data: feedback };
    } catch (error) {
        return { success: false, error: 'Failed to submit feedback' };
    }
}

// --- CALIBRATION ACTIONS ---

export async function getCalibrationData(cycleId: string) {
    try {
        const appraisals = await prisma.appraisal.findMany({
            where: { cycleId },
            include: {
                employee: true
            }
        });

        // Calculate stats
        const scores = appraisals.map(a => a.finalScore);
        const mean = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

        return {
            success: true,
            data: {
                appraisals,
                stats: {
                    mean,
                    count: appraisals.length
                }
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to fetch calibration data' };
    }
}

export async function updateAppraisalRating(id: string, rating: string, comment: string) {
    try {
        await prisma.appraisal.update({
            where: { id },
            data: {
                finalRating: rating,
                moderatorComment: comment,
                status: 'MODERATION'
            }
        });
        revalidatePath('/performance');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update rating' };
    }
}

