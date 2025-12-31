'use client';

import React, { useState, Suspense } from 'react';
import RequisitionManagement from '@/components/ats/RequisitionManagement';
import JobPostingManagement from '@/components/ats/JobPostingManagement';
import ApplicationManagement from '@/components/ats/ApplicationManagement';
import InterviewManagement from '@/components/ats/InterviewManagement';
import TalentPool from '@/components/ats/TalentPool';
import ScreeningManagement from '@/components/ats/ScreeningManagement';
import AssessmentManagement from '@/components/ats/AssessmentManagement';

const tabs = [
    { name: 'Job Requisitions', icon: '📋' },
    { name: 'Job Postings', icon: '📢' },
    { name: 'Applications', icon: '📨' },
    { name: 'Talent Pool', icon: '👥' },
    { name: 'Screening', icon: '🔍' },
    { name: 'Interviews', icon: '🤝' },
    { name: 'Assessments', icon: '📝' },
    { name: 'Career Portal', icon: '🌐' },
];

export default function AtsDashboard() {
    const [activeTab, setActiveTab] = useState('Job Requisitions');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Recruitment ATS</h1>
                <p className="text-gray-500">Comprehensive recruitment and talent management suite.</p>
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

            <div className="card" style={{ minHeight: '600px', background: 'white' }}>
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading ATS...</div>}>
                    {activeTab === 'Job Requisitions' && <RequisitionManagement />}
                    {activeTab === 'Job Postings' && <JobPostingManagement />}
                    {activeTab === 'Applications' && <ApplicationManagement />}
                    {activeTab === 'Talent Pool' && <TalentPool />}
                    {activeTab === 'Screening' && <ScreeningManagement />}
                    {activeTab === 'Interviews' && <InterviewManagement />}
                    {activeTab === 'Assessments' && <AssessmentManagement />}
                    {activeTab === 'Career Portal' && (
                        <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌐</div>
                            <h3 className="text-xl font-bold">Public Career Portal</h3>
                            <p style={{ color: 'var(--slate-500)', maxWidth: '500px', marginTop: '0.5rem' }}>
                                This is the public-facing portal where candidates can view and apply for open positions in your organization.
                            </p>

                            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                <a href="/careers" target="_blank" className="btn btn-primary" style={{ textDecoration: 'none' }}>Open Portal Website</a>
                                <button className="btn" style={{ background: 'var(--slate-100)' }}>Copy Link</button>
                            </div>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}


