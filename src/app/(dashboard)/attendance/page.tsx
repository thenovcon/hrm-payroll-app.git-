'use client';

import React, { useState, Suspense } from 'react';
import AttendanceOverview from '@/components/attendance/AttendanceOverview';
import TimeCaptureEngine from '@/components/attendance/TimeCaptureEngine';
import ShiftManager from '@/components/attendance/ShiftManager';
import DailyRegister from '@/components/attendance/DailyRegister';
import ExceptionManagement from '@/components/attendance/ExceptionManagement';

const tabs = [
    { name: 'Overview', icon: '📊' },
    { name: 'Clock-In', icon: '🕒' },
    { name: 'Shift Manager', icon: '🗓️' },
    { name: 'Daily Register', icon: '📑' },
    { name: 'Exceptions', icon: '🚨' },
    { name: 'Overtime', icon: '💰' },
    { name: 'Analytics', icon: '📈' },
];

export default function AttendancePage() {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Attendance & Time Tracking</h1>
                <p className="text-gray-500">Self-cleaning system designed for Ghana’s real operating conditions.</p>
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
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading module...</div>}>
                    {activeTab === 'Overview' && <AttendanceOverview />}
                    {activeTab === 'Clock-In' && <TimeCaptureEngine />}
                    {activeTab === 'Shift Manager' && <ShiftManager />}
                    {activeTab === 'Daily Register' && <DailyRegister />}
                    {activeTab === 'Exceptions' && <ExceptionManagement />}
                    {['Overtime', 'Analytics'].includes(activeTab) && (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏗️</div>
                            <h3 className="text-xl font-bold">Building {activeTab} Engine</h3>
                            <p style={{ color: 'var(--slate-500)', maxWidth: '500px', margin: '1rem auto' }}>
                                We are currently implementing the specialized logic for {activeTab === 'Overtime' ? 'automated allowance calculations and payroll mapping' : 'attendance health scores and manager insights'}.
                            </p>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Configure Workflow</button>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}
