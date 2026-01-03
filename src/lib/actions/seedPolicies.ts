'use server';

import { prisma } from '@/lib/db/prisma';
import { revalidatePath } from 'next/cache';

export async function seedPolicies() {
    const policies = [
        {
            title: 'Employee Code of Conduct',
            category: 'CONDUCT',
            content: 'All employees are expected to maintain the highest standards of professional conduct. This includes treating colleagues with respect, avoiding conflicts of interest, and adhering to company confidentiality agreements. Harassment of any kind will not be tolerated.',
            fileUrl: null
        },
        {
            title: 'Annual Leave Policy',
            category: 'LEAVE',
            content: 'Employees are entitled to 20 days of paid annual leave per calendar year. Leave requests must be submitted at least 2 weeks in advance via the HR portal. Unused leave can be carried over up to 5 days into the first quarter of the next year.',
            fileUrl: null
        },
        {
            title: 'Health & Safety Guidelines',
            category: 'HEALTH',
            content: 'Your safety is our priority. All incidents, no matter how minor, must be reported to the Safety Officer immediately. Emergency exits must be kept clear at all times. Fire drills are conducted quarterly.',
            fileUrl: null
        },
        {
            title: 'Remote Work Policy',
            category: 'GENERAL',
            content: 'Eligible employees may work remotely up to 2 days per week with manager approval. Core hours of 10 AM to 3 PM GMT must be maintained regardless of location. VPN usage is mandatory for accessing company systems.',
            fileUrl: null
        },
        {
            title: 'Performance Review Process',
            category: 'GENERAL',
            content: 'Performance reviews are conducted bi-annually in June and December. The process involves self-assessment, peer feedback, and manager evaluation. KPIs are set at the beginning of the year.',
            fileUrl: null
        },
        {
            title: 'Social Media Policy',
            category: 'CONDUCT',
            content: 'Employees are representatives of the company. Posting confidential company information on social media is strictly prohibited. Personal views should be clearly stated as such and not attributed to the company.',
            fileUrl: null
        }
    ];

    try {
        // Clear existing for clean seed (optional, but good for demo)
        // await prisma.hRPolicy.deleteMany({}); 

        for (const p of policies) {
            // Check if exists to avoid dupes on re-seed
            const exists = await prisma.hRPolicy.findFirst({ where: { title: p.title } });
            if (!exists) {
                await prisma.hRPolicy.create({
                    data: {
                        title: p.title,
                        category: p.category,
                        content: p.content,
                        fileUrl: p.fileUrl,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                });
            }
        }
        revalidatePath('/policies');
        return { success: true };
    } catch (error) {
        console.error('Failed to seed policies:', error);
        return { success: false, error: 'Failed to seed policies' };
    }
}
