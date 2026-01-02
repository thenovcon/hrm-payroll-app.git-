'use client';

import React from 'react';
import Link from 'next/link';

interface TrainingCourse {
    id: string;
    title: string;
    category: string;
    deliveryMethod: string;
    duration?: string | null;
    contentUrl?: string | null;
    // ... other fields
}

interface TrainingCatalogProps {
    courses?: TrainingCourse[];
}

export default function TrainingCatalog({ courses = [] }: TrainingCatalogProps) {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Training Catalog</h3>
                    <p className="text-sm text-gray-500">Discover and manage learning content across the organization.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href="/training/new" className="btn btn-primary no-underline flex items-center justify-center">
                        + Create New Course
                    </Link>
                    <button className="btn">Import SCORM</button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <p>No training courses available yet.</p>
                    <p className="text-sm mt-2">Click "Create New Course" to get started.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {courses.map((c) => (
                        <div key={c.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'var(--primary-100)', color: 'var(--primary-700)', fontWeight: 700 }}>{c.category}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--slate-400)' }}>{c.duration || 'N/A'}</span>
                            </div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{c.title}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span className="badge">{c.deliveryMethod}</span>
                                {/* <span className="badge">{c.level}</span> */}
                            </div>

                            {c.contentUrl && (
                                <div className="mt-2">
                                    <a
                                        href={c.contentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        📄 Course Material
                                    </a>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--slate-100)', display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>View Course</button>
                                <button className="btn" style={{ fontSize: '0.8rem' }}>Assign</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
