'use client';

import React, { useState } from 'react';

export default function GoalTracker() {
    const goals = [
        { id: '1', title: 'Revenue Growth', category: 'Operational', weight: '40%', progress: 65, status: 'IN_PROGRESS', measurement: 'Numeric' },
        { id: '2', title: 'Professional Certification', category: 'Learning', weight: '20%', progress: 100, status: 'ACHIEVED', measurement: 'Milestone' },
        { id: '3', title: 'Team Mentorship', category: 'Behavioral', weight: '20%', progress: 30, status: 'IN_PROGRESS', measurement: 'Milestone' },
        { id: '4', title: 'Client Satisfaction Index', category: 'Operational', weight: '20%', progress: 85, status: 'IN_PROGRESS', measurement: 'Numeric' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Goals & OKRs</h3>
                    <p className="text-sm text-gray-500">Track progress against individual and departmental key results.</p>
                </div>
                <button className="btn btn-primary">+ New Goal</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Goal Name</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Category</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Weight</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Progress</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {goals.map((goal) => (
                            <tr key={goal.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{goal.title}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{goal.measurement}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                        {goal.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{goal.weight}</td>
                                <td style={{ padding: '1rem', width: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--slate-100)', borderRadius: '3px' }}>
                                            <div style={{ width: `${goal.progress}%`, height: '100%', background: 'var(--primary-500)', borderRadius: '3px' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{goal.progress}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className="badge" style={{
                                        background: goal.status === 'ACHIEVED' ? 'var(--accent-teal)20' : '#f59e0b20',
                                        color: goal.status === 'ACHIEVED' ? 'var(--accent-teal)' : '#f59e0b',
                                    }}>
                                        {goal.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Check-in</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--slate-50)', borderRadius: '8px', border: '1px dashed var(--slate-300)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', margin: 0 }}>
                    💡 <strong>Tip:</strong> Total goal weight for a cycle must equal 100%. Current allocated: <strong>100%</strong>
                </p>
            </div>
        </div>
    );
}
