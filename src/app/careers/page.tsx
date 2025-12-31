import React from 'react';
import Link from 'next/link';
import { getJobPostings } from '@/lib/actions/ats-actions';

export default async function CareerPortal() {
    const result = await getJobPostings();
    const postings = result.success ? (result.data?.filter((p: any) => p.status === 'ACTIVE') || []) : [];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--slate-50)', padding: '4rem 1rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary-900)', marginBottom: '1rem' }}>
                        Join Novcon Ghana
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--slate-600)' }}>
                        Help us build the future of human resource management in Ghana.
                    </p>
                </header>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {postings.length === 0 ? (
                        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                            <p style={{ color: 'var(--slate-500)' }}>No active openings at the moment. Please check back later!</p>
                        </div>
                    ) : (
                        postings.map((job: any) => (
                            <Link
                                key={job.id}
                                href={`/careers/${job.id}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div className="card" style={{
                                    padding: '2rem',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{job.title}</h2>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                                            <span>📍 {job.requisition?.location}</span>
                                            <span>⏱️ {job.requisition?.type}</span>
                                            <span>📂 {job.requisition?.department}</span>
                                        </div>
                                    </div>
                                    <div style={{
                                        color: 'var(--primary-600)',
                                        fontWeight: 600,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        View Details <span>→</span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.875rem' }}>
                    © {new Date().getFullYear()} Novcon Ghana. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
