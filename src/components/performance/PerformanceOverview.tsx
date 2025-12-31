'use client';

import React from 'react';

export default function PerformanceOverview() {
    const stats = [
        { label: 'Active Cycles', value: '2', icon: '📅' },
        { label: 'Completion Rate', value: '78%', icon: '📈' },
        { label: 'Top Performers', value: '12', icon: '🌟' },
        { label: 'At Risk (PIP)', value: '3', icon: '🚨' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {stats.map((stat) => (
                    <div key={stat.label} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Rating Distribution */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Performance Rating Distribution</h4>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', paddingBottom: '2rem' }}>
                        {[
                            { label: 'Outstanding', count: 5, color: 'var(--accent-teal)' },
                            { label: 'Exceeds', count: 18, color: 'var(--primary-400)' },
                            { label: 'Meets', count: 42, color: 'var(--primary-600)' },
                            { label: 'Improvement', count: 8, color: '#f59e0b' },
                            { label: 'Unsatisfactory', count: 2, color: '#ef4444' },
                        ].map((bar) => (
                            <div key={bar.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{
                                    width: '100%',
                                    height: `${(bar.count / 42) * 100}%`,
                                    background: bar.color,
                                    borderRadius: '4px 4px 0 0',
                                    position: 'relative'
                                }}>
                                    <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', fontWeight: 700 }}>{bar.count}</span>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: 'var(--slate-500)', textAlign: 'center', height: '30px', overflow: 'hidden' }}>{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Recent Activities</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {[
                            { user: 'Samuel Mensah', action: 'submitted self-assessment', time: '2h ago' },
                            { user: 'Akua Addo', action: 'reached 100% of Sales Goal', time: '5h ago' },
                            { user: 'HR Admin', action: 'launched Q4 Review Cycle', time: '1d ago' },
                            { user: 'John Tetteh', action: 'received peer feedback', time: '1d ago' },
                        ].map((act, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-500)', marginTop: '4px' }}></div>
                                <div>
                                    <p style={{ fontSize: '0.875rem', margin: 0 }}><strong>{act.user}</strong> {act.action}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', margin: 0 }}>{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="btn" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.875rem' }}>View Audit Log</button>
                </div>
            </div>
        </div>
    );
}
