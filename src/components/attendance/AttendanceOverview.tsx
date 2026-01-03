'use client';

import React, { useEffect, useState } from 'react';
import { getDailyAttendance } from '@/lib/actions/attendance-actions';

export default function AttendanceOverview() {
    const [stats, setStats] = useState({
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        exceptions: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            const result = await getDailyAttendance();
            if (result.success && result.data) {
                const records = result.data;
                setStats({
                    present: records.filter((r: any) => r.status === 'PRESENT').length,
                    absent: records.filter((r: any) => r.status === 'ABSENT').length,
                    late: records.filter((r: any) => r.status === 'LATE').length,
                    onLeave: records.filter((r: any) => r.status === 'ON_LEAVE').length,
                    exceptions: records.filter((r: any) => r.exceptions && r.exceptions.length > 0).length
                });
            }
            setLoading(false);
        }
        fetchStats();
    }, []);

    const cards = [
        { title: 'Present', value: stats.present, color: 'var(--accent-teal)', icon: '🟢' },
        { title: 'Late', value: stats.late, color: '#f59e0b', icon: '🟡' },
        { title: 'Absent', value: stats.absent, color: '#ef4444', icon: '🔴' },
        { title: 'On Leave', value: stats.onLeave, color: '#3b82f6', icon: '🔵' },
        { title: 'Exceptions', value: stats.exceptions, color: '#8b5cf6', icon: '💡' },
    ];

    if (loading) return <div style={{ padding: '2rem' }}>Loading snapshot...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {cards.map((card) => (
                    <div key={card.title} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${card.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{card.title}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{card.value}</h3>
                            </div>
                            <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1rem', fontWeight: 600 }}>Payroll Readiness Meter</h4>
                    <div style={{ height: '24px', background: 'var(--slate-100)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
                        <div style={{ width: '85%', height: '100%', background: 'linear-gradient(to right, var(--primary-500), var(--accent-teal))' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <span>85% Ready</span>
                        <span>15% Exceptions Pending</span>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent-amber)' }}>
                    <h4 style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--accent-amber)' }}>🚨 Payroll Alerts</h4>
                    <ul style={{ fontSize: '0.875rem', color: 'var(--text-primary)', listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>• 12 Missed Punches detected</li>
                        <li style={{ marginBottom: '0.5rem' }}>• 4 Unapproved Overtime claims</li>
                        <li>• 2 Shift Mismatches found</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
