'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LeaveApprovalList from './LeaveApprovalList';
import LeaveBalances from './LeaveBalances';

export default function LeaveDashboard({
    requests,
    userId,
    employeeId,
    role,
    balances
}: {
    requests: any[],
    userId: string,
    employeeId: string,
    role: string,
    balances: any[]
}) {
    const [activeTab, setActiveTab] = useState('My Requests');

    // Filter by EmployeeID for "My Requests", but by LineManagerID (which is likely UserID? Or EmployeeID?)
    // In seed script: deptMap.get(dept).managerId -> This likely refers to User ID or Employee ID?
    // User model has role. Employee model has managerId.
    // Usually managerId in Employee refers to the Manager's Employee ID.
    const myRequests = requests.filter(r => r.employeeId === employeeId);

    // Team Requests: where lineManagerId matches THIS user's Employee ID (if they are a manager)
    const teamRequests = requests.filter(r => r.lineManagerId === employeeId);

    const allRequests = requests; // For HR

    const tabs = [
        { name: 'My Requests', icon: '👤', count: myRequests.filter(r => r.status === 'PENDING').length },
        { name: 'Balance Overview', icon: '⚖️', count: 0 },
    ];

    if (role === 'MANAGER' || teamRequests.length > 0) {
        tabs.push({ name: 'Team Approvals', icon: '👥', count: teamRequests.filter(r => r.managerApprovalStatus === 'PENDING').length });
    }

    if (role === 'ADMIN' || role === 'HR') {
        tabs.push({ name: 'Admin Approvals', icon: '⚖️', count: allRequests.filter(r => r.managerApprovalStatus === 'APPROVED' && r.hrApprovalStatus === 'PENDING').length });
    }

    return (
        <div>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Annual Leave Available</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>
                        {balances.find(b => b.leaveType.name.includes('Annual'))?.daysAllocated - balances.find(b => b.leaveType.name.includes('Annual'))?.daysUsed || 0} Days
                    </p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>My Pending</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{myRequests.filter(r => r.status === 'PENDING').length}</p>
                </div>
                {tabs.find(t => t.name === 'Team Approvals') && (
                    <div className="card" style={{ borderLeft: '4px solid var(--accent-teal)' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Team Pending</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{teamRequests.filter(r => r.managerApprovalStatus === 'PENDING').length}</p>
                    </div>
                )}
                {tabs.find(t => t.name === 'Admin Approvals') && (
                    <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>HR Queue</p>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{allRequests.filter(r => r.managerApprovalStatus === 'APPROVED' && r.hrApprovalStatus === 'PENDING').length}</p>
                    </div>
                )}
            </div>

            {/* Tab Navigation */}
            <div className="card" style={{ padding: '0.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', background: 'var(--bg-card)' }}>
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
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{tab.icon}</span>
                        {tab.name}
                        {tab.count > 0 && (
                            <span style={{
                                background: 'var(--primary-500)',
                                color: 'white',
                                fontSize: '0.6rem',
                                padding: '1px 5px',
                                borderRadius: '10px',
                                marginLeft: '4px'
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="card" style={{ minHeight: '400px', background: 'var(--bg-card)' }}>
                {activeTab === 'My Requests' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 className="text-xl font-bold">My Leave History</h2>
                            <Link href="/leave/new" className="btn btn-primary">+ New Request</Link>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--slate-100)', color: 'var(--slate-500)', fontSize: '0.875rem' }}>
                                    <th style={{ padding: '1rem' }}>Type</th>
                                    <th style={{ padding: '1rem' }}>Dates</th>
                                    <th style={{ padding: '1rem' }}>Days</th>
                                    <th style={{ padding: '1rem' }}>Workflow Progress</th>
                                    <th style={{ padding: '1rem' }}>Final Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myRequests.map(req => (
                                    <tr key={req.id} style={{ borderBottom: '1px solid var(--slate-50)' }}>
                                        <td style={{ padding: '1rem', fontWeight: 600 }}>{req.leaveType.name}</td>
                                        <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem' }}>{req.daysRequested}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <span title="Line Manager Approval" style={{
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    background: req.managerApprovalStatus === 'APPROVED' ? 'var(--accent-teal)' : req.managerApprovalStatus === 'REJECTED' ? '#ef4444' : 'var(--slate-200)'
                                                }}></span>
                                                <div style={{ width: '20px', height: '2px', background: 'var(--slate-100)' }}></div>
                                                <span title="HR Approval" style={{
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    background: req.hrApprovalStatus === 'APPROVED' ? 'var(--accent-teal)' : req.hrApprovalStatus === 'REJECTED' ? '#ef4444' : 'var(--slate-200)'
                                                }}></span>
                                            </div>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.65rem', color: 'var(--slate-400)' }}>
                                                {req.managerApprovalStatus === 'PENDING' ? 'Waiting for Manager' : req.hrApprovalStatus === 'PENDING' ? 'Waiting for HR' : 'Workflow Complete'}
                                            </p>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                                                background: req.status === 'PENDING' ? 'var(--primary-50)' : req.status === 'APPROVED' ? '#dcfce7' : '#fee2e2',
                                                color: req.status === 'PENDING' ? 'var(--primary-700)' : req.status === 'APPROVED' ? '#166534' : '#991b1b'
                                            }}>{req.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'Balance Overview' && (
                    <LeaveBalances balances={balances} />
                )}

                {activeTab === 'Team Approvals' && (
                    <LeaveApprovalList requests={requests} role="MANAGER" userId={userId} />
                )}

                {activeTab === 'Admin Approvals' && (
                    <LeaveApprovalList requests={requests} role="HR" userId={userId} />
                )}
            </div>
        </div>
    );
}
