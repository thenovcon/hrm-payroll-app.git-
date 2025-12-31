'use client';

import React, { useState, useEffect } from 'react';
import { getShifts, createShift } from '@/lib/actions/attendance-actions';

export default function ShiftManager() {
    const [shifts, setShifts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const result = await getShifts();
        if (result.success) setShifts(result.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await createShift(formData);
        if (result.success) {
            setShowCreate(false);
            fetchData();
        } else {
            alert(result.error);
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h3 className="text-lg font-bold">Shift & Work Pattern Manager</h3>
                    <p className="text-sm text-gray-500">Define work hours, grace periods, and roster assignments.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>Create New Shift</button>
            </div>

            {showCreate && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--slate-50)' }}>
                    <h4 style={{ marginBottom: '1rem' }}>Define Shift</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                        <div>
                            <label className="label">Shift Name</label>
                            <input name="name" className="input" placeholder="e.g. Standard Morning" required />
                        </div>
                        <div>
                            <label className="label">Start Time</label>
                            <input name="startTime" type="time" className="input" required />
                        </div>
                        <div>
                            <label className="label">End Time</label>
                            <input name="endTime" type="time" className="input" required />
                        </div>
                        <div>
                            <label className="label">Grace Period (mins)</label>
                            <input name="gracePeriod" type="number" className="input" defaultValue="15" />
                        </div>
                        <div>
                            <label className="label">Break Duration (mins)</label>
                            <input name="breakDuration" type="number" className="input" defaultValue="60" />
                        </div>
                        <div>
                            <label className="label">Color Label</label>
                            <input name="color" type="color" className="input" defaultValue="#3b82f6" />
                        </div>
                        <div style={{ gridColumn: 'span 3', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary">Save Shift</button>
                            <button type="button" className="btn" onClick={() => setShowCreate(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {loading ? (
                    <p>Loading shifts...</p>
                ) : (
                    shifts.map((shift) => (
                        <div key={shift.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: shift.color || '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                                {shift.name[0]}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h5 style={{ fontWeight: 600 }}>{shift.name}</h5>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    {shift.startTime} - {shift.endTime} ({shift.gracePeriod}m grace)
                                </p>
                            </div>
                            <button className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>Assign</button>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Active Roster Assignments</h4>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'var(--slate-50)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Employee</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Current Shift</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Pattern</th>
                                <th style={{ padding: '1rem', textAlign: 'left' }}>Effective From</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '1rem' }}>Samuel Mensah</td>
                                <td style={{ padding: '1rem' }}><span className="badge" style={{ background: '#3b82f620', color: '#3b82f6' }}>Morning 9-5</span></td>
                                <td style={{ padding: '1rem' }}>Fixed Mon-Fri</td>
                                <td style={{ padding: '1rem' }}>Jan 1, 2024</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1rem' }}>Akua Addo</td>
                                <td style={{ padding: '1rem' }}><span className="badge" style={{ background: '#8b5cf620', color: '#8b5cf6' }}>Night Shift</span></td>
                                <td style={{ padding: '1rem' }}>Rotational (4 on/2 off)</td>
                                <td style={{ padding: '1rem' }}>Feb 15, 2024</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
