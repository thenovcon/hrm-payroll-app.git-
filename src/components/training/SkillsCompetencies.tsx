'use client';

import React, { useState } from 'react';

export default function SkillsCompetencies() {
    const [view, setView] = useState('library'); // library, mapping, gaps

    const skills = [
        { name: 'JavaScript / TypeScript', category: 'Technical', level: 'Expert', roles: 'Engineering' },
        { name: 'Financial Modeling', category: 'Technical', level: 'Advanced', roles: 'Finance' },
        { name: 'Conflict Resolution', category: 'Behavioral', level: 'Intermediate', roles: 'All' },
        { name: 'Strategic Leadership', category: 'Leadership', level: 'Advanced', roles: 'Management' },
        { name: 'GDPR / Data Privacy', category: 'Compliance', level: 'Advanced', roles: 'All' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Skills & Competency Framework</h3>
                    <p className="text-sm text-gray-500">Define, measure, and map skills across your organization.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary">+ Add New Skill</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--slate-100)', paddingBottom: '0.5rem' }}>
                {['Library', 'Role Mapping', 'Skill Gaps'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setView(t.toLowerCase().replace(' ', ''))}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: 'none',
                            fontWeight: 600,
                            color: view === t.toLowerCase().replace(' ', '') ? 'var(--primary-600)' : 'var(--slate-500)',
                            borderBottom: view === t.toLowerCase().replace(' ', '') ? '2px solid var(--primary-600)' : 'none',
                            cursor: 'pointer'
                        }}
                    >{t}</button>
                ))}
            </div>

            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
                            <th style={{ padding: '1rem' }}>Skill Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Proficiency Level</th>
                            <th style={{ padding: '1rem' }}>Applicable Roles</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((s, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--slate-50)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{s.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--slate-100)' }}>{s.category}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>{s.level}</td>
                                <td style={{ padding: '1rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>{s.roles}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
