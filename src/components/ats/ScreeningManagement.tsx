'use client';

import React, { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus } from '@/lib/actions/ats-actions';

export default function ScreeningManagement() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getApplications();
        if (result.success) {
            // Filter only candidates in SCREENING or NEW status
            setApplications(result.data?.filter((app: any) => app.status === 'APPLIED' || app.status === 'SCREENING') || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (id: string, status: string) => {
        const result = await updateApplicationStatus(id, status);
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Candidate Screening</h3>
                <p className="text-sm text-gray-500">Review new applicants and move them to the screening phase.</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Candidate</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Position</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Loading candidates...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No candidates to screen.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{app.candidate?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.candidate?.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{app.jobPosting?.title}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: app.status === 'APPLIED' ? 'var(--primary-50)' : 'var(--accent-teal)15',
                                            color: app.status === 'APPLIED' ? 'var(--primary-700)' : 'var(--accent-teal)'
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {app.status === 'APPLIED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, 'SCREENING')}
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                                >
                                                    Start Screening
                                                </button>
                                            )}
                                            {app.status === 'SCREENING' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                                                    className="btn btn-primary"
                                                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--accent-teal)' }}
                                                >
                                                    Pass to Interview
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                className="btn"
                                                style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: '#fee2e2', color: '#dc2626' }}
                                            >
                                                Reject
                                            </button>
                                        </div>
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
