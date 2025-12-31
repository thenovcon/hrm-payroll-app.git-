'use server';

import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getRequisitions() {
    try {
        const requisitions = await prisma.requisition.findMany({
            orderBy: { createdAt: 'desc' },
            include: { createdBy: true, jobPosting: true }
        });
        return { success: true, data: requisitions };
    } catch (error) {
        console.error('Fetch Requisitions Failed:', error);
        return { success: false, error: 'Failed to fetch requisitions' };
    }
}

export async function updateRequisitionStatus(id: string, status: string) {
    const session = await auth();
    if ((session?.user as any)?.role !== 'ADMIN' && (session?.user as any)?.role !== 'HR') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prisma.requisition.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/ats');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update requisition' };
    }
}

export async function createRequisition(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { success: false, error: 'Unauthorized' };
    }

    const title = formData.get('title') as string;
    const department = formData.get('department') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const priority = formData.get('priority') as string;
    const headcount = parseInt(formData.get('headcount') as string) || 1;
    const justification = formData.get('justification') as string;

    if (!title || !department || !location) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        const count = await prisma.requisition.count();
        const reqNumber = `REQ-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

        await prisma.requisition.create({
            data: {
                reqNumber,
                title,
                department,
                location,
                type,
                priority,
                headcount,
                justification,
                createdById: session.user.id,
                status: 'PENDING'
            }
        });

        revalidatePath('/ats');
        return { success: true };
    } catch (error) {
        console.error('Create Requisition Failed:', error);
        return { success: false, error: 'Failed to create requisition' };
    }
}

// --- JOB POSTING ACTIONS ---

export async function getJobPostings() {
    try {
        const postings = await prisma.jobPosting.findMany({
            orderBy: { createdAt: 'desc' },
            include: { requisition: true }
        });
        return { success: true, data: postings };
    } catch (error) {
        return { success: false, error: 'Failed to fetch job postings' };
    }
}

export async function createJobPosting(requisitionId: string) {
    const session = await auth();
    if (!session) return { success: false, error: 'Unauthorized' };

    try {
        const requisition = await prisma.requisition.findUnique({
            where: { id: requisitionId }
        });

        if (!requisition) return { success: false, error: 'Requisition not found' };

        const posting = await prisma.jobPosting.create({
            data: {
                requisitionId,
                title: requisition.title,
                content: `<h1>${requisition.title}</h1><p>We are looking for a ${requisition.type} in ${requisition.location}.</p>`,
                status: 'DRAFT'
            }
        });

        revalidatePath('/ats');
        return { success: true, data: posting };
    } catch (error) {
        console.error('Create Job Posting Failed:', error);
        return { success: false, error: 'Failed to create job posting' };
    }
}

export async function updateJobPosting(id: string, data: any) {
    try {
        await prisma.jobPosting.update({
            where: { id },
            data
        });
        revalidatePath('/ats');
        revalidatePath('/careers');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update job posting' };
    }
}


export async function submitApplication(formData: FormData) {
    const jobId = formData.get('jobId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const source = formData.get('source') as string || 'CAREER_PORTAL';

    if (!jobId || !name || !email) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // Find or create candidate
        let candidate = await prisma.candidate.findUnique({
            where: { email }
        });

        if (!candidate) {
            candidate = await prisma.candidate.create({
                data: {
                    name,
                    email,
                    phone
                }
            });
        }

        // Check if already applied
        const existingApp = await prisma.application.findFirst({
            where: {
                candidateId: candidate.id,
                jobPostingId: jobId
            }
        });

        if (existingApp) {
            return { success: false, error: 'You have already applied for this position' };
        }

        await prisma.application.create({
            data: {
                jobPostingId: jobId,
                candidateId: candidate.id,
                status: 'APPLIED',
                source
            }
        });

        revalidatePath('/ats');
        return { success: true };
    } catch (error) {
        console.error('Submit Application Failed:', error);
        return { success: false, error: 'Failed to submit application' };
    }
}

export async function getApplications() {
    try {
        const applications = await prisma.application.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                candidate: true,
                jobPosting: true
            }
        });
        return { success: true, data: applications };
    } catch (error) {
        return { success: false, error: 'Failed to fetch applications' };
    }
}

export async function updateApplicationStatus(id: string, status: string) {
    try {
        await prisma.application.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/ats');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update application status' };
    }
}

export async function getInterviews() {
    try {
        const interviews = await prisma.interview.findMany({
            orderBy: { interviewDate: 'asc' },
            include: {
                application: {
                    include: {
                        candidate: true,
                        jobPosting: true
                    }
                },
                interviewer: true
            }
        });
        return { success: true, data: interviews };
    } catch (error) {
        return { success: false, error: 'Failed to fetch interviews' };
    }
}

export async function scheduleInterview(formData: FormData) {
    const applicationId = formData.get('applicationId') as string;
    const interviewDate = new Date(formData.get('date') as string);
    const type = formData.get('type') as string;
    const location = formData.get('location') as string;

    if (!applicationId || !formData.get('date')) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        await prisma.interview.create({
            data: {
                applicationId,
                interviewDate,
                type,
                location,
                status: 'SCHEDULED'
            }
        });

        // Update application status automatically
        await prisma.application.update({
            where: { id: applicationId },
            data: { status: 'INTERVIEW' }
        });

        revalidatePath('/ats');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to schedule interview' };
    }
}

export async function getCandidates() {
    try {
        const candidates = await prisma.candidate.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                applications: {
                    include: {
                        jobPosting: true
                    }
                }
            }
        });
        return { success: true, data: candidates };
    } catch (error) {
        return { success: false, error: 'Failed to fetch candidates' };
    }
}
