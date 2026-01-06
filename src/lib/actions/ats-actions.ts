'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const serialize = (obj: any): any => JSON.parse(JSON.stringify(obj));

// --- JOB POSTINGS ---

export async function getJobPostings() {
    try {
        const postings = await prisma.jobPosting.findMany({
            include: {
                requisition: true,
                _count: {
                    select: { applications: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: serialize(postings) };
    } catch (error) {
        console.error('Error fetching job postings:', error);
        return { success: false, error: 'Failed to fetch job postings' };
    }
}

export async function createJobPosting(requisitionId: string) {
    try {
        const session = await auth();
        // if (!session?.user) return { success: false, error: 'Unauthorized' };

        const requisition = await prisma.requisition.findUnique({
            where: { id: requisitionId }
        });

        if (!requisition) {
            return { success: false, error: 'Requisition not found' };
        }

        const posting = await prisma.jobPosting.create({
            data: {
                requisitionId,
                title: requisition.title,
                content: requisition.jobDescription || 'No description provided.',
                status: 'DRAFT'
            }
        });

        revalidatePath('/ats');
        return { success: true, data: serialize(posting) };
    } catch (error) {
        console.error('Error creating job posting:', error);
        return { success: false, error: 'Failed to create job posting' };
    }
}

export async function updateJobPosting(id: string, data: { status?: string; content?: string }) {
    try {
        const posting = await prisma.jobPosting.update({
            where: { id },
            data
        });
        revalidatePath('/ats');
        return { success: true, data: serialize(posting) };
    } catch (error) {
        console.error('Error updating job posting:', error);
        return { success: false, error: 'Failed to update job posting' };
    }
}

// --- REQUISITIONS ---

export async function getRequisitions() {
    try {
        const reqs = await prisma.requisition.findMany({
            include: { jobPosting: true },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: serialize(reqs) };
    } catch (error) {
        console.error('Error fetching requisitions:', error);
        return { success: false, error: 'Failed to fetch requisitions' };
    }
}

export async function createRequisition(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

        // Basic validation/parsing
        const data = {
            title: formData.get('title') as string,
            department: formData.get('department') as string,
            location: formData.get('location') as string,
            type: formData.get('type') as string,
            priority: formData.get('priority') as string,
            headcount: parseInt(formData.get('headcount') as string) || 1,
            justification: formData.get('justification') as string,
            reqNumber: `REQ-${Date.now().toString().slice(-6)}`, // Simple ID gen
            createdById: session.user.id
        };

        const requisition = await prisma.requisition.create({ data });
        revalidatePath('/ats');
        return { success: true, data: serialize(requisition) };
    } catch (error) {
        console.error('Error creating requisition:', error);
        return { success: false, error: 'Failed to create requisition' };
    }
}

export async function updateRequisitionStatus(id: string, status: string) {
    try {
        const req = await prisma.requisition.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/ats');
        return { success: true, data: req };
    } catch (error) {
        console.error('Error updating requisition:', error);
        return { success: false, error: 'Failed to update requisition' };
    }
}

// --- APPLICATIONS ---

export async function getApplications() {
    try {
        const apps = await prisma.application.findMany({
            include: {
                candidate: true,
                jobPosting: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: serialize(apps) };
    } catch (error) {
        console.error('Error fetching applications:', error);
        return { success: false, error: 'Failed to fetch applications' };
    }
}

export async function submitApplication(formData: FormData) {
    try {
        // Parse form data
        const jobId = formData.get('jobId') as string;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const resumeUrl = (formData.get('resumeUrl') as string) || null;

        // Check if candidate exists by email, else create
        let candidate = await prisma.candidate.findUnique({ where: { email } });
        if (!candidate) {
            candidate = await prisma.candidate.create({
                data: { name, email, phone, resumeUrl }
            });
        }

        const application = await prisma.application.create({
            data: {
                jobPostingId: jobId,
                candidateId: candidate.id,
                status: 'APPLIED',
                source: 'Career Portal'
            }
        });

        revalidatePath('/ats');
        return { success: true, data: serialize(application) };
    } catch (error) {
        console.error('Error creating application:', error);
        return { success: false, error: 'Failed to submit application' };
    }
}

export async function updateApplicationStatus(id: string, status: string) {
    try {
        const app = await prisma.application.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/ats');
        return { success: true, data: serialize(app) };
    } catch (error) {
        console.error('Error updating application:', error);
        return { success: false, error: 'Failed to update application' };
    }
}

// --- INTERVIEWS ---

export async function getInterviews() {
    try {
        const interviews = await prisma.interview.findMany({
            include: {
                application: {
                    include: {
                        candidate: true,
                        jobPosting: true
                    }
                }
            },
            orderBy: { interviewDate: 'asc' }
        });
        return { success: true, data: serialize(interviews) };
    } catch (error) {
        console.error('Error fetching interviews:', error);
        return { success: false, error: 'Failed to fetch interviews' };
    }
}

export async function scheduleInterview(formData: FormData) {
    try {
        const applicationId = formData.get('applicationId') as string;
        const date = new Date(formData.get('date') as string);
        const type = formData.get('type') as string;
        const location = formData.get('location') as string;

        const interview = await prisma.interview.create({
            data: {
                applicationId,
                interviewDate: date,
                type,
                location,
                status: 'SCHEDULED'
            }
        });

        // Auto-update application status
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: 'INTERVIEW' }
        });

        revalidatePath('/ats');
        return { success: true, data: interview };
    } catch (error) {
        console.error('Error scheduling interview:', error);
        return { success: false, error: 'Failed to schedule interview' };
    }
}

// --- CANDIDATES ---

export async function getCandidates() {
    try {
        const candidates = await prisma.candidate.findMany({
            include: {
                applications: {
                    include: { jobPosting: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: serialize(candidates) };
    } catch (error) {
        console.error('Error fetching candidates:', error);
        return { success: false, error: 'Failed to fetch candidates' };
    }
}


export async function getRecruitmentFunnelStats() {
    const session = await auth();
    if (!session?.user) return null;

    // TODO: Add Department filtering logic if user is DEPT_HEAD
    // For now, fetch global stats

    // Group applications by status
    const statusCounts = await prisma.application.groupBy({
        by: ['status'],
        _count: {
            id: true
        }
    });

    // Valid funnel stages order
    const funnelOrder = ['APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'];

    // Map to clean format
    const funnelData = funnelOrder.map(stage => {
        const found = statusCounts.find(s => s.status === stage);
        return {
            stage,
            count: found?._count.id || 0
        };
    });

    return funnelData;
}

export async function getJobStats() {
    const jobStats = await prisma.jobPosting.groupBy({
        by: ['status'],
        _count: {
            id: true
        }
    });
    return jobStats.map(s => ({ status: s.status, count: s._count.id }));
}
