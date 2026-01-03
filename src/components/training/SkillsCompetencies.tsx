'use client';

import React, { useState } from 'react';

export default function SkillsCompetencies() {
    const [view, setView] = useState('library'); // library, mapping, gaps
    const [editingSkill, setEditingSkill] = useState<string | null>(null);

    const skills = [
        { id: 1, name: 'JavaScript / TypeScript', category: 'Technical', level: 'Expert', roles: 'Engineering', gap: false },
        { id: 2, name: 'Financial Modeling', category: 'Technical', level: 'Advanced', roles: 'Finance', gap: false },
        { id: 3, name: 'Conflict Resolution', category: 'Behavioral', level: 'Intermediate', roles: 'All', gap: true },
        { id: 4, name: 'Strategic Leadership', category: 'Leadership', level: 'Advanced', roles: 'Management', gap: false },
        { id: 5, name: 'GDPR / Data Privacy', category: 'Compliance', level: 'Advanced', roles: 'All', gap: true },
    ];

    // Filter logic to solve "showing same info" issue
    const filteredSkills = skills.filter(s => {
        if (view === 'library') return true;
        if (view === 'rolemapping') return s.roles !== 'All'; // Show specific mappings
        if (view === 'skillgaps') return s.gap; // Show only gaps
        return true;
    });

    const handleEdit = (skill: any) => {
        setEditingSkill(skill.name);
        // Simulate edit
        const newValue = window.prompt(`Edit Skill Name for ${skill.name}:`, skill.name);
        if (newValue) {
            alert(`Skill updated to: ${newValue}`); // Demo feedback
            setEditingSkill(null);
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Skills & Competency Framework</h3>
                    <p className="text-sm text-gray-500">Define, measure, and map skills across your organization.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary" onClick={() => alert('Add Skill Modal would open here')}>+ Add New Skill</button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
                {['Library', 'Role Mapping', 'Skill Gaps'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setView(t.toLowerCase().replace(' ', ''))}
                        style={{
                            padding: '0.5rem 1rem',
                            border: 'none',
                            background: 'none',
                            fontWeight: 600,
                            color: view === t.toLowerCase().replace(' ', '') ? 'var(--primary-600)' : 'var(--text-secondary)',
                            borderBottom: view === t.toLowerCase().replace(' ', '') ? '2px solid var(--primary-600)' : 'none',
                            cursor: 'pointer'
                        }}
                    >{t}</button>
                ))}
            </div>

            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
                            <th style={{ padding: '1rem' }}>Skill Name</th>
                            <th style={{ padding: '1rem' }}>Category</th>
                            <th style={{ padding: '1rem' }}>Proficiency Level</th>
                            {view !== 'library' && <th style={{ padding: '1rem' }}>{view === 'skillgaps' ? 'Gap Analysis' : 'Applicable Roles'}</th>}
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSkills.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found for this view.</td></tr>
                        ) : (
                            filteredSkills.map((s, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{s.name}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'var(--bg-subtle)' }}>{s.category}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{s.level}</td>
                                    {view !== 'library' && (
                                        <td style={{ padding: '1rem', fontSize: '0.875rem', color: view === 'skillgaps' ? '#ef4444' : 'var(--text-secondary)' }}>
                                            {view === 'skillgaps' ? 'Missing (Target: Expert)' : s.roles}
                                        </td>
                                    )}
                                    <td style={{ padding: '1rem' }}>
                                        <button
                                            className="btn"
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
                                            onClick={() => handleEdit(s)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
