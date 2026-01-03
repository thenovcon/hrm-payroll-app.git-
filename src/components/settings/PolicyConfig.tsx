'use client';

import React from 'react';

export default function PolicyConfig() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">HR Policy Configuration</h3>
                <p className="text-sm text-gray-500">Fine-tune rules for accruals, shifts, ratings, and compliance.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📅</span>
                        <h4 className="text-lg font-bold">Leave Policies</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'Annual Leave Carry-over', value: 'MAX 5 Days' },
                            { label: 'Encashment Threshold', value: 'After 10 Days' },
                            { label: 'Minimum Tenure for Leave', value: '3 Months' },
                        ].map((p, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{p.label}</span>
                                <input type="text" className="input" defaultValue={p.value} style={{ width: '120px', height: '28px', fontSize: '0.75rem', padding: '0 0.5rem' }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>⏱️</span>
                        <h4 className="text-lg font-bold">Attendance Rules</h4>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'Grace Period (Lateness)', value: '15 Mins' },
                            { label: 'Overtime Calculation Start', value: 'After 9 Hours' },
                            { label: 'Break Deduction (Auto)', value: '60 Mins' },
                        ].map((p, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--slate-50)' }}>
                                <span style={{ color: 'var(--slate-600)' }}>{p.label}</span>
                                <input type="text" className="input" defaultValue={p.value} style={{ width: '120px', height: '28px', fontSize: '0.75rem', padding: '0 0.5rem' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary">Apply Policy Changes</button>
            </div>
        </div>
    );
}
