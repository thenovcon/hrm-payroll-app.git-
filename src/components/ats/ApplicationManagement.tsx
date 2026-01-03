'use client';

import React, { useState, useEffect } from 'react';
import { getApplications, updateApplicationStatus } from '@/lib/actions/ats-actions';

export default function ApplicationManagement() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getApplications();
        if (result.success) {
            setApplications(result.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        const result = await updateApplicationStatus(id, status);
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPLIED': return 'var(--primary-600)';
            case 'SCREENING': return 'var(--accent-teal)';
            case 'INTERVIEW': return 'var(--accent-amber)';
            case 'OFFERED': return '#059669';
            case 'HIRED': return '#047857';
            case 'REJECTED': return '#ef4444';
            default: return 'var(--slate-500)';
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Manage Applications</h3>
                <p className="text-sm text-gray-500">Review and manage candidate applications through the recruitment funnel.</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Candidate</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Position</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading applications...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No applications received yet.</td></tr>
                        ) : (
                            applications.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{app.candidate?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.candidate?.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 500 }}>{app.jobPosting?.title}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{app.source}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: `${getStatusColor(app.status)}15`,
                                            color: getStatusColor(app.status)
                                        }}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                                        {new Date(app.createdAt).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                                            style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem',
                                                borderRadius: '0.25rem',
                                                border: '1px solid var(--slate-200)'
                                            }}
                                        >
                                            <option value="APPLIED">Applied</option>
                                            <option value="SCREENING">Screening</option>
                                            <option value="INTERVIEW">Interview</option>
                                            <option value="OFFERED">Offered</option>
                                            <option value="HIRED">Hired</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
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
