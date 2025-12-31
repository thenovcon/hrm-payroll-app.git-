'use client';

import React, { useState, useEffect } from 'react';
import { clockIn, clockOut } from '@/lib/actions/attendance-actions';

export default function TimeCaptureEngine() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [msg, setMsg] = useState('');
    const [location, setLocation] = useState<{ lat?: number, lng?: number, name?: string }>({ name: 'Accra Office' });

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAction = async (type: 'IN' | 'OUT') => {
        setStatus('LOADING');
        // In a real app, we would use navigator.geolocation here
        const data = {
            employeeId: 'EMP-TEMP-001', // This should come from the session
            method: 'WEB',
            lat: 5.6037, // Accra coordinates
            lng: -0.1870,
            locationName: 'Headquarters, Accra'
        };

        const result = type === 'IN' ? await clockIn(data) : await clockOut(data);

        if (result.success) {
            setStatus('SUCCESS');
            setMsg(`Successfully clocked ${type === 'IN' ? 'in' : 'out'} at ${currentTime.toLocaleTimeString()}`);
        } else {
            setStatus('ERROR');
            setMsg(result.error || 'Operation failed');
        }
    };

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '3rem', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Current Time</p>
                    <h2 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--primary-900)', fontFamily: 'monospace' }}>
                        {currentTime.toLocaleTimeString()}
                    </h2>
                    <p style={{ color: 'var(--slate-500)' }}>{currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={() => handleAction('IN')}
                        disabled={status === 'LOADING'}
                        className="btn btn-primary"
                        style={{ padding: '1.25rem 2.5rem', fontSize: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <span>🕒</span>
                        Clock In
                    </button>
                    <button
                        onClick={() => handleAction('OUT')}
                        disabled={status === 'LOADING'}
                        className="btn"
                        style={{ padding: '1.25rem 2.5rem', fontSize: '1.25rem', background: 'var(--slate-800)', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <span>🏁</span>
                        Clock Out
                    </button>
                </div>

                <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: '12px', textAlign: 'left', marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>📍 Detected Location:</p>
                    <p style={{ fontWeight: 600 }}>{location.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>5.6037° N, 0.1870° W</p>
                </div>

                {status !== 'IDLE' && (
                    <div style={{ padding: '1rem', borderRadius: '8px', background: status === 'SUCCESS' ? 'var(--accent-teal)15' : 'var(--error-50)', color: status === 'SUCCESS' ? 'var(--accent-teal)' : 'var(--error-600)', fontWeight: 600 }}>
                        {status === 'LOADING' ? 'Processing...' : msg}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '3rem', maxWidth: '800px', width: '100%' }}>
                <h4 style={{ marginBottom: '1rem' }}>Clock-In History</h4>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--slate-50)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>In</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Out</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Total Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '1rem' }}>Dec 30, 2024</td>
                                <td style={{ padding: '1rem' }}>08:55 AM</td>
                                <td style={{ padding: '1rem' }}>05:12 PM</td>
                                <td style={{ padding: '1rem' }}>8.2h</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1rem' }}>Dec 29, 2024</td>
                                <td style={{ padding: '1rem' }}>09:02 AM</td>
                                <td style={{ padding: '1rem' }}>05:05 PM</td>
                                <td style={{ padding: '1rem' }}>8.0h</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
