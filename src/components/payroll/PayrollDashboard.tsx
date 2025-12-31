'use client';

import React from 'react';

export default function PayrollDashboard() {
    const stats = [
        { label: 'This Month Total', value: 'GHS 425,000', change: '+2.4%', icon: '💰' },
        { label: 'Avg. Net Pay', value: 'GHS 4,250', change: '+0.5%', icon: '👤' },
        { label: 'Total Statutory', value: 'GHS 85,400', change: '+1.8%', icon: '🏛️' },
        { label: 'Variance Alerts', value: '3 High', change: '-1', icon: '🚨' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.5rem',
                                borderRadius: '9999px',
                                background: stat.change.startsWith('+') ? 'var(--accent-teal)20' : 'var(--error-50)',
                                color: stat.change.startsWith('+') ? 'var(--accent-teal)' : 'var(--error-600)'
                            }}>
                                {stat.change}
                            </span>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Variance Tracker */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', fontWeight: 600 }}>Variance Analysis (Oct vs Nov)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { item: 'Basic Salary', prev: '210k', curr: '215k', diff: '+5k', reason: '2 New hires' },
                            { item: 'Overtime', prev: '15k', curr: '22k', diff: '+7k', reason: 'Seasonal surge' },
                            { item: 'Allowances', prev: '45k', curr: '45k', diff: '0', reason: '-' },
                            { item: 'Deductions', prev: '12k', curr: '18k', diff: '+6k', reason: 'Staff loans' },
                        ].map((v) => (
                            <div key={v.item} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1.5fr', alignItems: 'center', fontSize: '0.875rem', padding: '0.75rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
                                <span style={{ fontWeight: 600 }}>{v.item}</span>
                                <span style={{ color: 'var(--slate-500)' }}>{v.prev}</span>
                                <span style={{ color: 'var(--slate-800)', fontWeight: 600 }}>{v.curr}</span>
                                <span style={{ color: v.diff.startsWith('+') ? '#ef4444' : 'inherit' }}>{v.diff}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>{v.reason}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Compliance Status */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', fontWeight: 600 }}>Compliance Readiness</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ fontWeight: 600 }}>GRA PAYE Data</span>
                                <span style={{ color: 'var(--accent-teal)' }}>Ready</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--accent-teal)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ fontWeight: 600 }}>SSNIT Tier 1 & 2</span>
                                <span style={{ color: 'var(--accent-teal)' }}>Ready</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                <div style={{ width: '100%', height: '100%', background: 'var(--accent-teal)', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                <span style={{ fontWeight: 600 }}>Bank Disbursement File</span>
                                <span style={{ color: '#f59e0b' }}>75% (8 pending)</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                <div style={{ width: '75%', height: '100%', background: '#f59e0b', borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>Generate Compliance Pack</button>
                </div>
            </div>
        </div>
    );
}
