'use client';

import React from 'react';

export default function PIPManager() {
    const pips = [
        { id: '1', name: 'John Doe', stage: 'Month 1 Checkpoint', status: 'ACTIVE', startDate: '2024-11-01', endDate: '2025-01-31' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">Performance Improvement Plans (PIP)</h3>
                <p className="text-sm text-gray-500">Structured support and tracking for employees needing to meet role expectations.</p>
            </div>

            {pips.length === 0 ? (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🛡️</div>
                    <p style={{ color: 'var(--slate-500)' }}>No active Performance Improvement Plans. Great job!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {pips.map((pip) => (
                        <div key={pip.id} className="card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div>
                                    <h4 style={{ fontWeight: 700 }}>{pip.name}</h4>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Cycle: {pip.startDate} to {pip.endDate}</p>
                                </div>
                                <span className="badge" style={{ background: '#ef444420', color: '#ef4444' }}>{pip.status}</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', background: 'var(--slate-50)', padding: '1rem', borderRadius: '8px' }}>
                                <div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>CURRENT STAGE</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pip.stage}</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>COMPLIANCE</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Satisfactory</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--slate-500)', marginBottom: '0.25rem' }}>NEXT REVIEW</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>Jan 15, 2025</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.875rem' }}>Record Checkpoint</button>
                                <button className="btn" style={{ flex: 1, fontSize: '0.875rem', border: '1px solid var(--slate-200)', background: 'white' }}>View Improvement Goals</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="btn" style={{ marginTop: '2rem', border: '1px solid var(--primary-200)', color: 'var(--primary-700)', width: '100%', background: 'var(--primary-50)' }}>
                + Initiate New PIP (Requires HR Moderation)
            </button>
        </div>
    );
}
