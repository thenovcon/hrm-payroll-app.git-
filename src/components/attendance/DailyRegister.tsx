'use client';

import React, { useState, useEffect } from 'react';
import { getDailyAttendance } from '@/lib/actions/attendance-actions';
import { format } from 'date-fns';

export default function DailyRegister() {
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const fetchData = async () => {
        setLoading(true);
        const result = await getDailyAttendance(selectedDate);
        if (result.success) setRecords(result.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 className="text-lg font-bold">Daily Attendance Register</h3>
                    <p className="text-sm text-gray-500">The authoritative source for payroll processing.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input"
                        style={{ width: 'auto' }}
                    />
                    <button className="btn" style={{ background: 'var(--primary-600)', color: 'white' }}>Download CSV</button>
                    <button className="btn" style={{ background: 'var(--accent-teal)', color: 'white' }}>Lock & Sync to Payroll</button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }} className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Employee</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Shift</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>First In</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Last Out</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Work Hours</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Late (min)</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>OT (min)</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Payroll Ready</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center' }}>Loading register...</td></tr>
                        ) : records.length === 0 ? (
                            <tr><td colSpan={9} style={{ padding: '2rem', textAlign: 'center' }}>No attendance records found for this date.</td></tr>
                        ) : (
                            records.map((rec) => (
                                <tr key={rec.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{rec.employee?.firstName} {rec.employee?.lastName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{rec.employee?.employeeId}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{rec.shift?.name || '--'}</td>
                                    <td style={{ padding: '1rem' }}>{rec.clockIn ? format(new Date(rec.clockIn), 'HH:mm') : '--'}</td>
                                    <td style={{ padding: '1rem' }}>{rec.clockOut ? format(new Date(rec.clockOut), 'HH:mm') : '--'}</td>
                                    <td style={{ padding: '1rem' }}>{rec.hoursWorked.toFixed(1)}h</td>
                                    <td style={{ padding: '1rem', color: rec.lateMinutes > 0 ? 'var(--error-600)' : 'inherit' }}>
                                        {rec.lateMinutes}m
                                    </td>
                                    <td style={{ padding: '1rem', color: rec.overtimeMinutes > 0 ? 'var(--accent-teal)' : 'inherit' }}>
                                        {rec.overtimeMinutes}m
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="badge" style={{
                                            background: rec.status === 'PRESENT' ? 'var(--accent-teal)20' : rec.status === 'LATE' ? '#f59e0b20' : '#ef444420',
                                            color: rec.status === 'PRESENT' ? 'var(--accent-teal)' : rec.status === 'LATE' ? '#f59e0b' : '#ef4444'
                                        }}>
                                            {rec.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                        {rec.isVerified ? '✅' : '⏳'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
