'use client';

import React, { useState, Suspense } from 'react';
import PayrollDashboard from '@/components/payroll/PayrollDashboard';
import StatutorySetup from '@/components/payroll/StatutorySetup';
import SalaryManagement from '@/components/payroll/SalaryManagement';
import PayrollRunManager from '@/components/payroll/PayrollRunManager';
import PayslipGenerator from '@/components/payroll/PayslipGenerator';
import BankDisbursement from '@/components/payroll/BankDisbursement';
import ComplianceReports from '@/components/payroll/ComplianceReports';

const tabs = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Payroll Setup', icon: '⚙️' },
    { name: 'Employee Salaries', icon: '👤' },
    { name: 'Payroll Runs', icon: '🧾' },
    { name: 'Payslips', icon: '📑' },
    { name: 'Payments', icon: '💸' },
    { name: 'Reports', icon: '📉' },
];

export default function PayrollPage() {
    const [activeTab, setActiveTab] = useState('Dashboard');

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Payroll Management</h1>
                <p className="text-gray-500">Ghana-first payroll engine with integrated GRA & SSNIT compliance.</p>
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
                <Suspense fallback={<div style={{ padding: '2rem' }}>Loading payroll module...</div>}>
                    {activeTab === 'Dashboard' && <PayrollDashboard />}
                    {activeTab === 'Payroll Setup' && <StatutorySetup />}
                    {activeTab === 'Employee Salaries' && <SalaryManagement />}
                    {activeTab === 'Payroll Runs' && <PayrollRunManager />}
                    {activeTab === 'Payslips' && <PayslipGenerator />}
                    {activeTab === 'Payments' && <BankDisbursement />}
                    {activeTab === 'Reports' && <ComplianceReports />}
                </Suspense>
            </div>
        </div>
    );
}
