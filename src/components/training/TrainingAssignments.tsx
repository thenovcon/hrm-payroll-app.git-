'use client';

import React from 'react';

export default function TrainingAssignments() {
    const assignments = [
        { name: 'Samuel Mensah', course: 'Information Security 101', status: 'In Progress', progress: 45, deadline: '2024-04-15' },
        { name: 'Akua Addo', course: 'Leadership Core', status: 'Enrolled', progress: 0, deadline: '2024-05-01' },
        { name: 'John Doe', course: 'OHS Safety Certification', status: 'Completed', progress: 100, deadline: '2024-03-20' },
        { name: 'Kwame Osei', course: 'Project Management Core', status: 'Overdue', progress: 15, deadline: '2024-03-01' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Assignments & Enrollment</h3>
                    <p className="text-sm text-gray-500">Monitor learner progress and manage corporate training tracks.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-primary">Bulk Assign</button>
                    <button className="btn">Export Status</button>
                </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
                            <th style={{ padding: '1rem' }}>Employee</th>
                            <th style={{ padding: '1rem' }}>Course</th>
                            <th style={{ padding: '1rem' }}>Progress</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((a, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--slate-50)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{a.name}</td>
                                <td style={{ padding: '1rem' }}>{a.course}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ flex: 1, height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${a.progress}%`, height: '100%', background: a.status === 'Overdue' ? '#ef4444' : 'var(--primary-500)' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', minWidth: '30px' }}>{a.progress}%</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        background: a.status === 'Completed' ? 'var(--accent-teal)10' : a.status === 'Overdue' ? '#ef444410' : 'var(--slate-100)',
                                        color: a.status === 'Completed' ? 'var(--accent-teal)' : a.status === 'Overdue' ? '#ef4444' : 'var(--slate-600)',
                                    }}>{a.status}</span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{a.deadline}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
