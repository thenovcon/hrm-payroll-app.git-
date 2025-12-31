'use client';

import React, { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus } from '@/lib/actions/ats-actions';

export default function AssessmentManagement() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getApplications();
        if (result.success) {
            // Assessment is usually between Screening and Interview or parallel
            setApplications(result.data?.filter((app: any) => app.status === 'SCREENING' || app.status === 'INTERVIEW') || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Assessments</h3>
                <p className="text-sm text-gray-500">Manage technical and behavioral assessments for shortlisted candidates.</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Candidate</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Assessment Title</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Score</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading assessments...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No active assessments.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{app.candidate?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.jobPosting?.title}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>General Aptitude Test</td>
                                    <td style={{ padding: '1rem' }}>-- / 100</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: 'var(--slate-100)',
                                            color: 'var(--slate-600)'
                                        }}>
                                            PENDING
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            className="btn btn"
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--primary-50)', color: 'var(--primary-700)' }}
                                            onClick={() => alert('Feature coming soon: Sending assessment link...')}
                                        >
                                            Send Link
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
