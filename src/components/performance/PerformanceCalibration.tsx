'use client';

import React, { useState, useEffect } from 'react';

export default function PerformanceCalibration() {
    const [view, setView] = useState('Overview'); // Overview, BellCurve, ForcedDistribution, Session, Outliers
    const [selectedCycle, setSelectedCycle] = useState('Annual Review 2024');

    const stats = [
        { label: 'Total Appraisals', value: '62', trend: '0%' },
        { label: 'Average Score', value: '3.8', trend: '+0.2' },
        { label: 'Outliers Flagged', value: '5', trend: '🚨' },
        { label: 'Calibration Status', value: 'In Progress', color: '#f59e0b' },
    ];

    const distributionData = [
        { band: '1 - Unsatisfactory', count: 2, target: '10%', actual: '3%' },
        { band: '2 - Needs Improv.', count: 8, target: '20%', actual: '13%' },
        { band: '3 - Meets', count: 32, target: '40%', actual: '52%' },
        { band: '4 - Exceeds', count: 15, target: '20%', actual: '24%' },
        { band: '5 - Outstanding', count: 5, target: '10%', actual: '8%' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Calibration & Rating Normalization</h3>
                    <p className="text-sm text-gray-500">Ensure fairness and consistency across departments and teams.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <select className="input" value={selectedCycle} onChange={(e) => setSelectedCycle(e.target.value)} style={{ width: '220px' }}>
                        <option>Annual Review 2024</option>
                        <option>Q4 Probation 2024</option>
                    </select>
                    <button className="btn btn-primary">Start Calibration Session</button>
                </div>
            </div>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>{stat.label}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.25rem' }}>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{stat.value}</h4>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stat.color || 'var(--accent-teal)' }}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Visual Distribution */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <h4 style={{ fontWeight: 700 }}>Rating Distribution (Actual vs. Bell Curve)</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn" style={{ fontSize: '0.75rem' }}>Bell Curve Map</button>
                            <button className="btn" style={{ fontSize: '0.75rem' }}>Forced Targets</button>
                        </div>
                    </div>

                    <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '2rem', padding: '0 1rem' }}>
                        {distributionData.map((d, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                                    {/* Bell Curve Background Placeholder */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${parseInt(d.target)}%`,
                                        background: 'var(--slate-50)',
                                        border: '1px dashed var(--slate-300)',
                                        borderRadius: '4px 4px 0 0'
                                    }}></div>
                                    {/* Actual Bar */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: '20%',
                                        width: '60%',
                                        height: `${(d.count / 32) * 100}%`,
                                        background: 'var(--primary-500)',
                                        borderRadius: '4px 4px 0 0',
                                        zIndex: 1
                                    }}></div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 700, margin: 0 }}>{d.band}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--slate-500)', margin: 0 }}>{d.actual} (Target: {d.target})</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Outlier Alerts */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Outlier Detection (±2σ)</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'Samuel Mensah', dept: 'Engineering', score: '4.9', tag: 'High Performance', color: 'var(--accent-teal)' },
                            { name: 'John Doe', dept: 'Operations', score: '1.2', tag: 'Significant Deviation', color: '#ef4444' },
                            { name: 'Akua Addo', dept: 'HR', score: '4.8', tag: 'Consistency Alert', color: 'var(--primary-500)' },
                        ].map((o, i) => (
                            <div key={i} style={{ padding: '0.75rem', background: 'var(--slate-50)', borderRadius: '8px', borderLeft: `4px solid ${o.color}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem', margin: 0 }}>{o.name}</p>
                                    <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>{o.score}</span>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: '0.25rem 0' }}>{o.dept}</p>
                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: o.color }}>{o.tag}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.875rem' }}>Full Outlier Report</button>
                </div>
            </div>

            <div className="card" style={{ marginTop: '1.5rem', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Calibration Session Workspace</h4>
                <div className="card" style={{ padding: '4rem', textAlign: 'center', background: 'var(--slate-50)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🤝</div>
                    <h5 style={{ fontWeight: 700 }}>No Active Session</h5>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', maxWidth: '400px', margin: '0.5rem auto' }}>
                        Launch a calibration session to discuss and adjust ratings with department heads and HR leads.
                    </p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>New Calibration Session</button>
                </div>
            </div>
        </div>
    );
}
