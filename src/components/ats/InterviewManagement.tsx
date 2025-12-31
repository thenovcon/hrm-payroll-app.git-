'use client';

import React, { useState, useEffect } from 'react';
import { getInterviews, scheduleInterview, getApplications } from '@/lib/actions/ats-actions';

export default function InterviewManagement() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSchedule, setShowSchedule] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const [intRes, appRes] = await Promise.all([
            getInterviews(),
            getApplications()
        ]);
        if (intRes.success) setInterviews(intRes.data || []);
        if (appRes.success) setApplications(appRes.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await scheduleInterview(formData);
        if (result.success) {
            setShowSchedule(false);
            fetchData();
        } else {
            alert(result.error);
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Interview Scheduling</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowSchedule(!showSchedule)}
                >
                    {showSchedule ? 'Cancel' : '+ Schedule Interview'}
                </button>
            </div>

            {showSchedule && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--slate-50)' }}>
                    <h4 className="font-bold" style={{ marginBottom: '1rem' }}>Schedule New Interview</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="text-sm font-medium">Select Application</label>
                            <select name="applicationId" className="searchInput" style={{ width: '100%' }} required>
                                <option value="">-- Select Candidate --</option>
                                {applications.filter(a => a.status !== 'HIRED' && a.status !== 'REJECTED').map(app => (
                                    <option key={app.id} value={app.id}>
                                        {app.candidate.name} - {app.jobPosting.title} ({app.status})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Date & Time</label>
                            <input name="date" type="datetime-local" className="searchInput" style={{ width: '100%' }} required />
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Interview Type</label>
                            <select name="type" className="searchInput" style={{ width: '100%' }}>
                                <option value="SCREENING">Screening</option>
                                <option value="TECHNICAL">Technical</option>
                                <option value="CULTURAL">Cultural</option>
                                <option value="FINAL">Final</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="text-sm font-medium">Location / Link</label>
                            <input name="location" className="searchInput" style={{ width: '100%' }} placeholder="e.g. Google Meet Link or Room 302" />
                        </div>
                        <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Schedule Interview</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--slate-200)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Candidate</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Type</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date & Time</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>Loading interviews...</td></tr>
                        ) : interviews.length === 0 ? (
                            <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No interviews scheduled.</td></tr>
                        ) : (
                            interviews.map((int) => (
                                <tr key={int.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{int.application.candidate.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{int.application.jobPosting.title}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="text-xs font-bold" style={{ color: 'var(--primary-600)' }}>{int.type}</span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        {new Date(int.interviewDate).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: int.status === 'SCHEDULED' ? 'var(--accent-amber)' : 'var(--accent-teal)'
                                        }}>
                                            {int.status}
                                        </span>
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
