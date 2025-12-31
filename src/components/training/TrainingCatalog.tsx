'use client';

import React from 'react';

export default function TrainingCatalog() {
    const courses = [
        { title: 'Information Security 101', category: 'Compliance', method: 'E-Learning', duration: '2 hours', level: 'Beginner' },
        { title: 'Project Management Core', category: 'Internal', method: 'Instructor-Led', duration: '3 days', level: 'Intermediate' },
        { title: 'Python for Data Science', category: 'Technical', method: 'Self-Paced', duration: '20 hours', level: 'Advanced' },
        { title: 'Managerial Communication', category: 'Behavioral', method: 'Workshop', duration: '1 day', level: 'Intermediate' },
        { title: 'OHS Safety Certification', category: 'Compliance', method: 'On-site', duration: '4 hours', level: 'All Levels' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Training Catalog</h3>
                    <p className="text-sm text-gray-500">Discover and manage learning content across the organization.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary">+ Create New Course</button>
                    <button className="btn">Import SCORM</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.map((c, i) => (
                    <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--primary-100)', color: 'var(--primary-700)', fontWeight: 700 }}>{c.category}</span>
                            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--slate-400)' }}>{c.duration}</span>
                        </div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{c.title}</h4>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span className="badge">{c.method}</span>
                            <span className="badge">{c.level}</span>
                        </div>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>View Course</button>
                            <button className="btn" style={{ fontSize: '0.8rem' }}>Assign</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
