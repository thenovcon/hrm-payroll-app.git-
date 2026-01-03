'use client';

import React, { useState, useEffect } from 'react';
import { getRequisitions, createRequisition, updateRequisitionStatus } from '@/lib/actions/ats-actions';

export default function RequisitionManagement() {
    const [requisitions, setRequisitions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const handleStatusUpdate = async (id: string, status: string) => {
        const result = await updateRequisitionStatus(id, status);
        if (result.success) {
            fetchRequisitions();
        } else {
            alert(result.error);
        }
    };

    const fetchRequisitions = async () => {
        setLoading(true);
        const result = await getRequisitions();
        if (result.success) {
            setRequisitions(result.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchRequisitions();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await createRequisition(formData);
        if (result.success) {
            setShowForm(false);
            fetchRequisitions();
        } else {
            alert(result.error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'var(--accent-teal)';
            case 'PENDING': return 'var(--accent-amber)';
            case 'REJECTED': return 'red';
            case 'DRAFT': return 'var(--slate-400)';
            default: return 'var(--slate-600)';
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Job Requisitions</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ New Requisition'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-card)' }}>
                    <h4 className="font-bold" style={{ marginBottom: '1rem' }}>Create New Requisition</h4>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label className="text-sm font-medium">Job Title</label>
                            <input name="title" className="searchInput" required style={{ width: '100%' }} placeholder="e.g. Senior Software Engineer" />
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Department</label>
                            <select name="department" className="searchInput" style={{ width: '100%' }}>
                                <option value="Engineering">Engineering</option>
                                <option value="Sales">Sales</option>
                                <option value="Marketing">Marketing</option>
                                <option value="HR">HR</option>
                                <option value="Operations">Operations</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Location</label>
                            <input name="location" className="searchInput" required style={{ width: '100%' }} placeholder="e.g. Accra, Remote" />
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Employment Type</label>
                            <select name="type" className="searchInput" style={{ width: '100%' }}>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Priority</label>
                            <select name="priority" className="searchInput" style={{ width: '100%' }}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="text-sm font-medium">Headcount</label>
                            <input name="headcount" type="number" className="searchInput" defaultValue="1" style={{ width: '100%' }} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label className="text-sm font-medium">Headcount Justification</label>
                            <textarea name="justification" className="searchInput" style={{ width: '100%', minHeight: '80px' }} placeholder="Why is this position needed?" />
                        </div>
                        <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Requisition</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Req #</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Title</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Priority</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>Loading requisitions...</td></tr>
                        ) : requisitions.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No requisitions found. Create your first request.</td></tr>
                        ) : (
                            requisitions.map((req) => (
                                <tr key={req.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{req.reqNumber}</td>
                                    <td style={{ padding: '1rem' }}>{req.title}</td>
                                    <td style={{ padding: '1rem' }}>{req.department}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            background: req.priority === 'URGENT' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-subtle)',
                                            color: req.priority === 'URGENT' ? '#ef4444' : 'var(--text-secondary)'
                                        }}>
                                            {req.priority}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            color: getStatusColor(req.status),
                                            fontWeight: 600,
                                            fontSize: '0.875rem'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {req.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'APPROVED')}
                                                        style={{ color: 'var(--accent-teal)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                                                        style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                        </div>
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
