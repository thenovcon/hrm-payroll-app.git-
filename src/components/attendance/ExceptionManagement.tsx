'use client';

import React, { useState, useEffect } from 'react';
import { getExceptions, resolveException } from '@/lib/actions/attendance-actions';
import { format } from 'date-fns';

export default function ExceptionManagement() {
    const [exceptions, setExceptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getExceptions();
        if (result.success) setExceptions(result.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleResolve = async (id: string, status: string) => {
        const result = await resolveException(id, status);
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Attendance Exceptions & Regularization</h3>
                <p className="text-sm text-gray-500">Approve or reject missed punch claims and lateness explanations.</p>
            </div>

            <div style={{ overflowX: 'auto' }} className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Date</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Employee</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Type</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Explanation</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Loading exceptions...</td></tr>
                        ) : exceptions.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No pending exceptions. Everything is clean!</td></tr>
                        ) : (
                            exceptions.map((ex) => (
                                <tr key={ex.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem' }}>{format(new Date(ex.record.date), 'MMM dd, yyyy')}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{ex.record.employee?.firstName} {ex.record.employee?.lastName}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="badge" style={{ background: '#f59e0b20', color: '#f59e0b', fontSize: '0.75rem' }}>{ex.type}</span>
                                    </td>
                                    <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                        <p style={{ fontSize: '0.875rem', margin: 0 }}>{ex.explanation}</p>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: '0.75rem',
                                            color: ex.status === 'PENDING' ? '#f59e0b' : ex.status === 'APPROVED' ? 'var(--accent-teal)' : '#ef4444'
                                        }}>
                                            {ex.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        {ex.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button onClick={() => handleResolve(ex.id, 'APPROVED')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Approve</button>
                                                <button onClick={() => handleResolve(ex.id, 'REJECTED')} className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: '#fee2e2', color: '#dc2626' }}>Reject</button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resolved</span>
                                        )}
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
