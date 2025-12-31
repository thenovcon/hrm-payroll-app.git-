'use client';

import React from 'react';
import Link from 'next/link';

export default function AgentPortal({ employee, stats }: { employee: any, stats: any }) {
    return (
        <div style={{ padding: '2rem' }}>
            {/* Welcome Header */}
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)', color: 'white', marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700 }}>Welcome back, {employee.firstName}!</h1>
                <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>{employee.position} • {employee.department?.name || 'No Department'}</p>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ borderLeft: '4px solid var(--primary-500)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Leave Balance</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{stats.leaveBalance} Days</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Pending Requests</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{stats.pendingRequests}</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-teal)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>Training Progress</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{stats.trainingProgress}%</p>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-500)' }}>This Month Attendance</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 800 }}>{stats.attendanceRate}%</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700 }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <Link href="/leave/new" className="btn" style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        border: '2px solid var(--slate-200)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>🏖️</span>
                        <span style={{ fontWeight: 600 }}>Request Leave</span>
                    </Link>
                    <Link href="/attendance" className="btn" style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        border: '2px solid var(--slate-200)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>⏰</span>
                        <span style={{ fontWeight: 600 }}>Clock In/Out</span>
                    </Link>
                    <Link href="/training" className="btn" style={{
                        padding: '1.5rem',
                        textAlign: 'center',
                        border: '2px solid var(--slate-200)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span style={{ fontSize: '2rem' }}>📚</span>
                        <span style={{ fontWeight: 600 }}>My Training</span>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>My Recent Requests</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                        <p>No recent requests. Use Quick Actions to get started!</p>
                    </div>
                </div>
                <div className="card">
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Events</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
                        <p>No upcoming events.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
