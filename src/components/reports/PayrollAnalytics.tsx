'use client';

import React from 'react';

export default function PayrollAnalytics() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Payroll & Cost Intelligence</h3>
                    <p className="text-sm text-gray-500">Track spending, overtime anomalies, and cost center efficiency.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary">Run Projection</button>
                    <button className="btn">Variance Report</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Budget vs. Actual Payroll (6 Months)</h4>
                    <div style={{ height: '250px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', padding: '1rem' }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                                <div style={{ flex: 1, height: '80%', background: 'var(--primary-200)', borderRadius: '2px' }} title="Budget"></div>
                                <div style={{ flex: 1, height: `${Math.random() * 40 + 50}%`, background: 'var(--primary-600)', borderRadius: '2px' }} title="Actual"></div>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--primary-200)' }}></div>
                            <span style={{ fontSize: '0.75rem' }}>Budgeted</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--primary-600)' }}></div>
                            <span style={{ fontSize: '0.75rem' }}>Actual Spent</span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Cost Center Allocation</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'Admin & HQ', value: '35%', color: 'var(--primary-500)' },
                            { name: 'Direct Labor', value: '45%', color: 'var(--accent-teal)' },
                            { name: 'Sales Commissions', value: '12%', color: '#f59e0b' },
                            { name: 'Other Benefits', value: '8%', color: 'var(--slate-400)' },
                        ].map((c, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>{c.name}</span>
                                    <span style={{ fontWeight: 700 }}>{c.value}</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                    <div style={{ width: c.value, height: '100%', background: c.color, borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
