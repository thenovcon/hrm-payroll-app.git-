'use client';

import React, { useState, Suspense } from 'react';
import CompanySetup from '@/components/settings/CompanySetup';
import UserRoles from '@/components/settings/UserRoles';
import ApprovalWorkflows from '@/components/settings/ApprovalWorkflows';
import PolicyConfig from '@/components/settings/PolicyConfig';

const tabs = [
    { name: 'Company Setup', icon: '🏢' },
    { name: 'Users & Roles', icon: '👥' },
    { name: 'Approval Workflows', icon: '🔁' },
    { name: 'HR Policies', icon: '📜' },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('Company Setup');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>System Settings</h1>
                <p className="text-gray-500">Control organizational configuration, access rules, and decision governance.</p>
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
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading settings...</div>}>
                    {activeTab === 'Company Setup' && <CompanySetup />}
                    {activeTab === 'Users & Roles' && <UserRoles />}
                    {activeTab === 'Approval Workflows' && <ApprovalWorkflows />}
                    {activeTab === 'HR Policies' && <PolicyConfig />}
                </Suspense>
            </div>
        </div>
    );
}
