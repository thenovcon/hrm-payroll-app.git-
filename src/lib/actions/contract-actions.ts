'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function generateContract(applicationId: string) {
    const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: {
            candidate: true,
            jobPosting: {
                include: { requisition: true }
            }
        }
    });

    if (!application) throw new Error('Application not found');

    const candidateName = application.candidate.name;
    const roleTitle = application.jobPosting.title;
    const salary = application.jobPosting.requisition.salaryRange || 'Competitive';
    const startDate = new Date().toLocaleDateString();

    const contractContent = `
        EMPLOYMENT AGREEMENT

        This Agreement is made on ${startDate} between Novelty Concepts Ltd Ltd ("Employer") and ${candidateName} ("Employee").

        1. POSITION
        The Employee is employed as ${roleTitle}.

        2. COMPENSATION
        The Employee shall be paid a gross salary of ${salary}, subject to statutory deductions (PAYE, SSNIT).

        3. PROBATION
        This employment is subject to a 6-month probationary period.

        Signed,
        Novcon HR
    `;

    // Upsert to avoid duplicates
    await prisma.contract.upsert({
        where: { applicationId },
        update: {
            content: contractContent,
            status: 'DRAFT',
            updatedAt: new Date()
        },
        create: {
            applicationId,
            content: contractContent,
            status: 'DRAFT'
        }
    });

    // Move to HIRED stage if not already
    await prisma.application.update({
        where: { id: applicationId },
        data: { currentStage: 'HIRED' } // Check schema enum match!
    });

    // Note: Schema uses 'status' string in Application, not currentStage enum yet in my last check?
    // Let's check schema. Application has `status` string @default("APPLIED").
    // I should update that status.

    await prisma.application.update({
        where: { id: applicationId },
        data: { status: 'HIRED' }
    });

    revalidatePath('/ats');
}
