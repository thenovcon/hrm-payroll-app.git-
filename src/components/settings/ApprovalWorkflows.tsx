'use client';

import React from 'react';

export default function ApprovalWorkflows() {
    const workflows = [
        { name: 'Annual Leave Approval', module: 'Leave Management', levels: 2, status: 'Active' },
        { name: 'Overtime Regularization', module: 'Attendance', levels: 1, status: 'Active' },
        { name: 'Payroll Finalization', module: 'Payroll', levels: 3, status: 'Active' },
        { name: 'Training Enrollment', module: 'Training', levels: 1, status: 'Inactive' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Approval Workflows</h3>
                    <p className="text-sm text-gray-500">Define multi-level routing and decision logic for organizational events.</p>
                </div>
                <button className="btn btn-primary">+ Build New Workflow</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {workflows.map((w, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', borderTop: `4px solid ${w.status === 'Active' ? 'var(--accent-teal)' : 'var(--slate-300)'}` }}>
                        <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--primary-50)', fontWeight: 700 }}>{w.module}</span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{w.name}</h4>
                        <p style={{ margin: '0.5rem 0 1.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{w.levels} Step Approval Chain</p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                            <span style={{ fontSize: '0.75rem', color: w.status === 'Active' ? 'var(--accent-teal)' : 'var(--slate-400)', fontWeight: 700 }}>● {w.status}</span>
                            <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>Configure</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
