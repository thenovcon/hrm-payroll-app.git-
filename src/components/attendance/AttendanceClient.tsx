'use client';

import React, { useState, Suspense } from 'react';
import AttendanceOverview from '@/components/attendance/AttendanceOverview';
import TimeCaptureEngine from '@/components/attendance/TimeCaptureEngine';
import ShiftManager from '@/components/attendance/ShiftManager';
import DailyRegister from '@/components/attendance/DailyRegister';
import ExceptionManagement from '@/components/attendance/ExceptionManagement';

interface Props {
    userRole: string;
}

export default function AttendanceClient({ userRole }: Props) {
    const [activeTab, setActiveTab] = useState('Overview');

    // Define tabs with visibility rules
    const allTabs = [
        { name: 'Overview', icon: '📊', roles: [] }, // All
        { name: 'Clock-In', icon: '🕒', roles: [] }, // All
        { name: 'Shift Manager', icon: '🗓️', roles: ['ADMIN', 'HR'] },
        { name: 'Daily Register', icon: '📑', roles: ['ADMIN', 'HR'] },
        { name: 'Exceptions', icon: '🚨', roles: ['ADMIN', 'HR', 'MANAGER'] },
        { name: 'Overtime', icon: '💰', roles: ['ADMIN', 'HR', 'ACCOUNTANT'] },
        { name: 'Analytics', icon: '📈', roles: ['ADMIN', 'HR'] },
    ];

    const visibleTabs = allTabs.filter(tab => {
        if (tab.roles.length === 0) return true;
        return tab.roles.includes(userRole);
    });

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Attendance & Time Tracking</h1>
                <p className="text-gray-500">Self-cleaning system designed for Ghana’s real operating conditions.</p>
            </div>

            {/* Sub-navigation */}
            <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'white' }}>
                {visibleTabs.map((tab) => (
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

                    {/* Protected Views */}
                    {activeTab === 'Shift Manager' && <ShiftManager />}
                    {activeTab === 'Daily Register' && <DailyRegister />}
                    {activeTab === 'Exceptions' && <ExceptionManagement />}

                    {['Overtime', 'Analytics'].includes(activeTab) && (
                        <div style={{ padding: '4rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏗️</div>
                            <h3 className="text-xl font-bold">Building {activeTab} Engine</h3>
                            <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Configure Workflow</button>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}
