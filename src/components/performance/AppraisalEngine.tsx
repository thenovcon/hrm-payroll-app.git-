'use client';

import React, { useState } from 'react';

export default function AppraisalEngine() {
    const [view, setView] = useState('list'); // 'list' or 'review'

    const appraisals = [
        { id: '1', name: 'Samuel Mensah', position: 'Senior Engineer', stage: 'SELF_ASSESSMENT', score: '-', rating: '-' },
        { id: '2', name: 'Akua Addo', position: 'HR Manager', stage: 'MANAGER_REVIEW', score: '4.2', rating: 'Exceeds Expectations' },
        { id: '3', name: 'John Tetteh', position: 'Operations Lead', stage: 'MODERATION', score: '3.8', rating: 'Meets Expectations' },
        { id: '4', name: 'Fatima Issah', position: 'Marketing Associate', stage: 'FINALIZED', score: '4.5', rating: 'Outstanding' },
    ];

    if (view === 'review') {
        return (
            <div style={{ padding: '1.5rem' }}>
                <button className="btn" onClick={() => setView('list')} style={{ marginBottom: '1.5rem' }}>← Back to All Appraisals</button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h3 className="text-2xl font-bold">Manager Review: Akua Addo</h3>
                        <p className="text-sm text-gray-500">Annual Review Cycle 2024 • HR Department</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span className="badge" style={{ background: '#f59e0b20', color: '#f59e0b' }}>MANAGER_REVIEW</span>
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.25rem' }}>Score: 4.2 / 5.0</h4>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Section 1: Goals */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '2px solid var(--primary-500)', display: 'inline-block' }}>1. Goal Achievement (60%)</h4>
                        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                            {[
                                { title: 'Revenue Growth', target: '1.2M', actual: '1.4M', score: 5 },
                                { title: 'Process Automation', target: '5 Workflows', actual: '4 Workflows', score: 4 },
                            ].map((g, i) => (
                                <div key={i} style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 600, margin: 0 }}>{g.title}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>Target: {g.target} | Actual: {g.actual}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <label className="label" style={{ fontSize: '0.65rem' }}>Rating (1-5)</label>
                                        <input type="number" defaultValue={g.score} style={{ width: '60px', padding: '0.25rem', textAlign: 'center' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2: Competencies */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ fontWeight: 700, marginBottom: '1rem', borderBottom: '2px solid var(--primary-500)', display: 'inline-block' }}>2. Core Competencies (30%)</h4>
                        <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
                            {[
                                { title: 'Leadership & Influence', rating: 4 },
                                { title: 'Communication Skills', rating: 5 },
                                { title: 'Problem Solving', rating: 3 },
                            ].map((c, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 500 }}>{c.title}</span>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <span key={star} style={{
                                                fontSize: '1.2rem',
                                                cursor: 'pointer',
                                                color: star <= c.rating ? '#f59e0b' : 'var(--slate-200)'
                                            }}>★</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-primary" style={{ flex: 1, padding: '1rem' }}>Submit Review & Move to Moderation</button>
                        <button className="btn" style={{ border: '1px solid var(--slate-200)', background: 'white' }}>Save as Draft</button>
                        <button className="btn" style={{ border: '1px solid #ef4444', color: '#ef4444', background: 'white' }}>Return for Revision</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Appraisal Workflow</h3>
                    <p className="text-sm text-gray-500">Monitor and conduct employee performance reviews.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input type="text" className="input" placeholder="Filter by employee..." style={{ width: '250px' }} />
                    <button className="btn">Filters</button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Employee</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Current Stage</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Score</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Rating</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appraisals.map((apr) => (
                            <tr key={apr.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{apr.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{apr.position}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        background: apr.stage === 'FINALIZED' ? 'var(--accent-teal)20' : 'var(--slate-100)',
                                        color: apr.stage === 'FINALIZED' ? 'var(--accent-teal)' : 'var(--slate-600)',
                                        fontWeight: 600
                                    }}>
                                        {apr.stage}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 700 }}>{apr.score}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.875rem' }}>{apr.rating}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => setView('review')}
                                        className="btn btn-primary"
                                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                    >
                                        {apr.stage === 'MANAGER_REVIEW' ? 'Conduct Review' : 'View Details'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
