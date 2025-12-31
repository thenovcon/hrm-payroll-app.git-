'use client';

import React from 'react';

export default function ReviewCycles() {
    const cycles = [
        { id: '1', name: 'Annual Review 2024', type: 'Annual', range: 'Jan 01 - Dec 31', status: 'ACTIVE', completion: 65 },
        { id: '2', name: 'Probation Review - Q4', type: 'Probation', range: 'Oct 01 - Dec 31', status: 'ACTIVE', completion: 40 },
        { id: '3', name: 'Mid-Year Review 2024', type: 'Bi-Annual', range: 'Jan 01 - Jun 30', status: 'COMPLETED', completion: 100 },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Review Cycles</h3>
                    <p className="text-sm text-gray-500">Configure and monitor performance appraisal periods.</p>
                </div>
                <button className="btn btn-primary">+ Create New Cycle</button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {cycles.map((cycle) => (
                    <div key={cycle.id} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{cycle.name}</h4>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>📅 {cycle.range}</span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>🏷️ {cycle.type}</span>
                                </div>
                            </div>
                            <span className="badge" style={{
                                background: cycle.status === 'ACTIVE' ? 'var(--accent-teal)20' : 'var(--slate-100)',
                                color: cycle.status === 'ACTIVE' ? 'var(--accent-teal)' : 'var(--slate-600)',
                            }}>
                                {cycle.status}
                            </span>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ fontWeight: 600 }}>Cycle Progress</span>
                                <span style={{ fontWeight: 700 }}>{cycle.completion}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                <div style={{ width: `${cycle.completion}%`, height: '100%', background: 'var(--primary-500)', borderRadius: '4px' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--slate-100)', paddingTop: '1.25rem' }}>
                            <button className="btn" style={{ fontSize: '0.875rem', flex: 1 }}>Configure Eligibility</button>
                            <button className="btn" style={{ fontSize: '0.875rem', flex: 1 }}>Manage Appraisals</button>
                            <button className="btn" style={{ fontSize: '0.875rem', flex: 1, border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }}>
                                {cycle.status === 'ACTIVE' ? 'Lock Cycle' : 'Archive'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
