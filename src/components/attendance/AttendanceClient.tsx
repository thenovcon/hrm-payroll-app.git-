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

                    {activeTab === 'Overtime' && (
                        <div style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 className="text-xl font-bold">Overtime Claims</h3>
                                <button className="btn btn-primary" onClick={() => alert('Feature disabled in Demo Mode')}>+ New Claim</button>
                            </div>
                            <div className="card" style={{ padding: 0 }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-light)' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left' }}>Employee</th>
                                            <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                            <th style={{ padding: '1rem', textAlign: 'left' }}>Hours</th>
                                            <th style={{ padding: '1rem', textAlign: 'left' }}>Reason</th>
                                            <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: '1rem' }}>John Doe</td>
                                            <td style={{ padding: '1rem' }}>2024-05-20</td>
                                            <td style={{ padding: '1rem' }}>2.5 hrs</td>
                                            <td style={{ padding: '1rem' }}>Project Deadline</td>
                                            <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>APPROVED</span></td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '1rem' }}>Samuel Mensah</td>
                                            <td style={{ padding: '1rem' }}>2024-05-21</td>
                                            <td style={{ padding: '1rem' }}>4.0 hrs</td>
                                            <td style={{ padding: '1rem' }}>System Maintenance</td>
                                            <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: '#fef3c7', color: '#b45309', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>PENDING</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Analytics' && (
                        <div style={{ padding: '2rem' }}>
                            <h3 className="text-xl font-bold mb-4">Attendance Analytics</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="card" style={{ padding: '1.5rem', height: '300px' }}>
                                    <h4 className="font-bold mb-4">Attendance Trend (30 Days)</h4>
                                    <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '5px' }}>
                                        {[60, 75, 80, 70, 85, 90, 88].map((h, i) => (
                                            <div key={i} style={{ width: '100%', background: 'var(--primary-200)', height: `${h}%`, borderRadius: '4px 4px 0 0' }}></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="card" style={{ padding: '1.5rem', height: '300px' }}>
                                    <h4 className="font-bold mb-4">Lateness by Department</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {['Engineering', 'Sales', 'Marketing', 'Finance'].map((d, i) => (
                                            <div key={i}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '5px' }}>
                                                    <span>{d}</span>
                                                    <span>{5 - i}%</span>
                                                </div>
                                                <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', width: `${(5 - i) * 10}%`, background: '#ef4444' }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    );
}
