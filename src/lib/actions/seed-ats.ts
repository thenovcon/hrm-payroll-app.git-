'use server';

import { prisma } from '@/lib/db/prisma';

export async function seedATS() {
    // 1. Create Vacancy (Requisition + Job Posting) - IT
    const itReq = await prisma.requisition.create({
        data: {
            reqNumber: 'REQ-DEMO-001',
            title: 'Senior Frontend Engineer',
            department: 'IT',
            location: 'Accra',
            type: 'Full-time',
            priority: 'HIGH',
            status: 'APPROVED',
            createdById: (await prisma.user.findFirst())?.id || '',
            jobPosting: {
                create: {
                    title: 'Senior Frontend Engineer',
                    content: 'We are looking for a React expert...',
                    status: 'ACTIVE'
                }
            }
        },
        include: { jobPosting: true }
    });

    // 2. HR Vacancy
    const hrReq = await prisma.requisition.create({
        data: {
            reqNumber: 'REQ-DEMO-002',
            title: 'People Operations Manager',
            department: 'HR',
            location: 'Kumasi',
            type: 'Full-time',
            priority: 'MEDIUM',
            status: 'APPROVED',
            createdById: (await prisma.user.findFirst())?.id || '',
            jobPosting: {
                create: {
                    title: 'People Operations Manager',
                    content: 'Manage our growing team...',
                    status: 'ACTIVE'
                }
            }
        },
        include: { jobPosting: true }
    });

    // 3. IT Vacancy 2
    const itReq2 = await prisma.requisition.create({
        data: {
            reqNumber: 'REQ-DEMO-003',
            title: 'DevOps Engineer',
            department: 'IT',
            location: 'Remote',
            type: 'Contract',
            priority: 'HIGH',
            status: 'APPROVED',
            createdById: (await prisma.user.findFirst())?.id || '',
            jobPosting: {
                create: {
                    title: 'DevOps Engineer',
                    content: 'AWS and Kubernetes expert needed...',
                    status: 'DRAFT'
                }
            }
        },
        include: { jobPosting: true }
    });

    // 4. Seed Applications with Scores
    if (itReq.jobPosting) {
        await prisma.candidate.create({
            data: {
                name: 'Kofi Mensah',
                email: 'kofi.dev@example.com',
                applications: {
                    create: {
                        jobPostingId: itReq.jobPosting.id,
                        status: 'SCREENED',
                        aiMatchScore: 85,
                        aiSummary: 'Strong React skills, 5 years experience. Good fit.'
                    }
                }
            }
        });

        await prisma.candidate.create({
            data: {
                name: 'Ama Osei',
                email: 'ama.ux@example.com',
                applications: {
                    create: {
                        jobPostingId: itReq.jobPosting.id,
                        status: 'APPLIED',
                        aiMatchScore: 45,
                        aiSummary: 'More designed focused, lacks TypeScript experience.'
                    }
                }
            }
        });
    }

    console.log('ATS Seeded: 3 Vacancies, 2 Candidates');
}
