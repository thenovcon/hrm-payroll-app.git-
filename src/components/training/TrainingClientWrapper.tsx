'use client';

import React, { useState, Suspense } from 'react';
import TrainingOverview from '@/components/training/TrainingOverview';
import SkillsCompetencies from '@/components/training/SkillsCompetencies';
import TrainingCatalog from '@/components/training/TrainingCatalog';
import TrainingAssignments from '@/components/training/TrainingAssignments';
import Certifications from '@/components/training/Certifications';

const tabs = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Skills & Competencies', icon: '🎓' },
    { name: 'Training Catalog', icon: '📚' },
    { name: 'Assignments', icon: '📝' },
    { name: 'Certifications', icon: '📜' },
];

interface TrainingClientWrapperProps {
    courses: any[]; // Using any[] for now to match the shape passed from server
}

export default function TrainingClientWrapper({ courses }: TrainingClientWrapperProps) {
    const [activeTab, setActiveTab] = useState('Dashboard');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Training & Learning</h1>
                <p className="text-gray-500">Empower your workforce with structured skills and continuous learning.</p>
            </div>

            {/* Sub-navigation */}
            <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'white' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.name}
                        onClick={() => setActiveTab(tab.name)}
                        style={{
                            padding: '0.75rem 1.25rem',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            background: activeTab === tab.name ? 'var(--primary-50)' : 'transparent',
                            color: activeTab === tab.name ? 'var(--primary-700)' : 'var(--slate-600)',
                            fontWeight: activeTab === tab.name ? 600 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="card" style={{ minHeight: '600px', background: 'white' }}>
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading training module...</div>}>
                    {activeTab === 'Dashboard' && <TrainingOverview />}
                    {activeTab === 'Skills & Competencies' && <SkillsCompetencies />}
                    {activeTab === 'Training Catalog' && <TrainingCatalog courses={courses} />}
                    {activeTab === 'Assignments' && <TrainingAssignments />}
                    {activeTab === 'Certifications' && <Certifications />}
                </Suspense>
            </div>
        </div>
    );
}
