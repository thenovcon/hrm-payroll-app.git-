'use client';

import React, { useState, Suspense } from 'react';
import PerformanceOverview from '@/components/performance/PerformanceOverview';
import GoalTracker from '@/components/performance/GoalTracker';
import ReviewCycles from '@/components/performance/ReviewCycles';
import AppraisalEngine from '@/components/performance/AppraisalEngine';
import PIPManager from '@/components/performance/PIPManager';
import FeedbackCenter from '@/components/performance/FeedbackCenter';
import PerformanceCalibration from '@/components/performance/PerformanceCalibration';

const tabs = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Goals', icon: '🎯' },
    { name: 'Review Cycles', icon: '🗓️' },
    { name: 'Appraisal Engine', icon: '📝' },
    { name: '360 Feedback', icon: '🔄' },
    { name: 'Calibration', icon: '⚖️' },
    { name: 'PIP', icon: '🛡️' },
];

export default function PerformancePage() {
    const [activeTab, setActiveTab] = useState('Dashboard');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Performance Management</h1>
                <p className="text-gray-500">Continuous feedback and objective-driven performance tracking.</p>
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
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading performance module...</div>}>
                    {activeTab === 'Dashboard' && <PerformanceOverview />}
                    {activeTab === 'Goals' && <GoalTracker />}
                    {activeTab === 'Review Cycles' && <ReviewCycles />}
                    {activeTab === 'Appraisal Engine' && <AppraisalEngine />}
                    {activeTab === '360 Feedback' && <FeedbackCenter />}
                    {activeTab === 'Calibration' && <PerformanceCalibration />}
                    {activeTab === 'PIP' && <PIPManager />}
                </Suspense>
            </div>
        </div>
    );
}


