'use client';

import React from 'react';

export default function TrainingOverview() {
    const stats = [
        { label: 'Active Learners', value: '42', trend: '+12%', color: 'var(--primary-600)' },
        { label: 'Completion Rate', value: '88%', trend: '+4%', color: 'var(--accent-teal)' },
        { label: 'Total Certifications', value: '156', trend: '+8', color: 'var(--primary-600)' },
        { label: 'Upcoming Sessions', value: '5', trend: 'Next: Monday', color: 'var(--accent-teal)' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '1.25rem', borderLeft: `4px solid ${stat.color}` }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>{stat.label}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.25rem' }}>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{stat.value}</h4>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: stat.color }}>{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1rem' }}>Active Training Campaigns</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { title: 'Cybersecurity Fundamentals', category: 'Compliance', progress: 65, learners: 24 },
                            { title: 'Advanced React Patterns', category: 'Technical', progress: 40, learners: 12 },
                            { title: 'Leadership & Emotional Intelligence', category: 'Behavioral', progress: 20, learners: 8 },
                        ].map((c, i) => (
                            <div key={i} style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div>
                                        <p style={{ fontWeight: 700, margin: 0 }}>{c.title}</p>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--slate-500)' }}>{c.category}</span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{c.progress}%</span>
                                </div>
                                <div style={{ height: '6px', background: 'var(--slate-200)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${c.progress}%`, height: '100%', background: 'var(--primary-500)' }}></div>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.5rem', margin: 0 }}>{c.learners} employees enrolled</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1rem' }}>Skill Gap Alerts</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { skill: 'Cloud Architecture', dept: 'Engineering', gap: 'High', color: '#ef4444' },
                            { skill: 'Strategic Planning', dept: 'Management', gap: 'Medium', color: '#f59e0b' },
                            { skill: 'Data Privacy', dept: 'Operations', gap: 'Urgent', color: '#ef4444' },
                        ].map((g, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--slate-100)', borderRadius: '8px' }}>
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: '0.875rem', margin: 0 }}>{g.skill}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>{g.dept}</p>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    background: `${g.color}10`,
                                    color: g.color,
                                    textTransform: 'uppercase'
                                }}>{g.gap}</span>
                            </div>
                        ))}
                    </div>
                    <button className="btn" style={{ width: '100%', marginTop: '1.5rem', fontSize: '0.875rem' }}>Run Full Analysis</button>
                </div>
            </div>
        </div>
    );
}
