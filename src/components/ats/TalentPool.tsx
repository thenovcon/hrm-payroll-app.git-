'use client';

import React, { useState, useEffect } from 'react';
import { getCandidates } from '@/lib/actions/ats-actions';

export default function TalentPool() {
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getCandidates();
        if (result.success) setCandidates(result.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Talent Pool</h3>
                <p className="text-sm text-gray-500">A unified database of all candidates who have applied to Novcon Ghana.</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Name</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Contact</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Applications</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Joined Pool</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Loading candidates...</td></tr>
                        ) : candidates.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No candidates in the pool yet.</td></tr>
                        ) : (
                            candidates.map((can) => (
                                <tr key={can.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{can.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontSize: '0.875rem' }}>{can.email}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{can.phone}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {can.applications?.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                                {can.applications.map((app: any) => (
                                                    <span key={app.id} style={{
                                                        padding: '0.125rem 0.375rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem',
                                                        background: 'var(--primary-50)',
                                                        color: 'var(--primary-700)',
                                                        border: '1px solid var(--primary-100)'
                                                    }}>
                                                        {app.jobPosting.title}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>None</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        {new Date(can.createdAt).toLocaleDateString()}
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
