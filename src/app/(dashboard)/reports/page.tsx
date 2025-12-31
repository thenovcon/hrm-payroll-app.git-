'use client';

import React, { useState, Suspense } from 'react';
import ExecutiveDashboard from '@/components/reports/ExecutiveDashboard';
import HRAnalytics from '@/components/reports/HRAnalytics';
import PayrollAnalytics from '@/components/reports/PayrollAnalytics';
import ComplianceAudit from '@/components/reports/ComplianceAudit';

const tabs = [
    { name: 'Executive Insights', icon: '💎' },
    { name: 'HR Operations', icon: '👥' },
    { name: 'Payroll & Cost', icon: '💰' },
    { name: 'Compliance & Audit', icon: '⚖️' },
];

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('Executive Insights');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Reports & Analytics</h1>
                    <p className="text-gray-500">Data-driven insights to help you make informed decisions.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select className="input" style={{ width: '150px' }}>
                        <option>Last 30 Days</option>
                        <option>Last Quarter</option>
                        <option>Year to Date</option>
                    </select>
                </div>
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
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading report module...</div>}>
                    {activeTab === 'Executive Insights' && <ExecutiveDashboard />}
                    {activeTab === 'HR Operations' && <HRAnalytics />}
                    {activeTab === 'Payroll & Cost' && <PayrollAnalytics />}
                    {activeTab === 'Compliance & Audit' && <ComplianceAudit />}
                </Suspense>
            </div>
        </div>
    );
}
