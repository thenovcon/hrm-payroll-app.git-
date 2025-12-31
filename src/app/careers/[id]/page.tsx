import React from 'react';
import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import ApplicationForm from '@/components/ats/ApplicationForm';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
    const { id } = await (params as any); // Next.js 16 params are async

    const job = await prisma.jobPosting.findUnique({
        where: { id },
        include: { requisition: true }
    });

    if (!job || job.status !== 'ACTIVE') {
        notFound();
    }

    return (
        <div style={{ minHeight: '100vh', background: 'white', padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <a href="/careers" style={{ color: 'var(--primary-600)', textDecoration: 'none', fontWeight: 600, display: 'inline-block', marginBottom: '2rem' }}>
                    ← Back to Job Board
                </a>

                <header style={{ marginBottom: '3rem' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--primary-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                        {job.requisition.department}
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--slate-900)' }}>
                        {job.title}
                    </h1>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--slate-500)' }}>
                        <span>📍 {job.requisition.location}</span>
                        <span>⏱️ {job.requisition.type}</span>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    <div>
                        <div
                            className="job-content"
                            style={{ lineHeight: 1.6, color: 'var(--slate-700)' }}
                            dangerouslySetInnerHTML={{ __html: job.content }}
                        />
                    </div>

                    <aside>
                        <div className="card" style={{ padding: '1.5rem', background: 'var(--slate-50)', position: 'sticky', top: '2rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Interested?</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
                                Apply now to join our team! Our recruiters will review your application soon.
                            </p>
                            <ApplicationForm jobId={job.id} />
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
