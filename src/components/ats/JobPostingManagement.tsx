'use client';

import React, { useState, useEffect } from 'react';
import { getJobPostings, createJobPosting, updateJobPosting, getRequisitions } from '@/lib/actions/ats-actions';

export default function JobPostingManagement() {
    const [postings, setPostings] = useState<any[]>([]);
    const [approvedReqs, setApprovedReqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const [postingsRes, reqsRes] = await Promise.all([
            getJobPostings(),
            getRequisitions()
        ]);

        if (postingsRes.success) setPostings(postingsRes.data || []);
        if (reqsRes.success) {
            // Only show reqs that are APPROVED and don't have a posting yet
            setApprovedReqs(reqsRes.data?.filter((r: any) => r.status === 'APPROVED' && !r.jobPosting) || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreatePosting = async (reqId: string) => {
        const result = await createJobPosting(reqId);
        if (result.success) {
            setShowCreate(false);
            fetchData();
        } else {
            alert(result.error);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const result = await updateJobPosting(id, { status });
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 className="text-lg font-bold">Job Postings</h3>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreate(!showCreate)}
                >
                    {showCreate ? 'Close' : 'Create from Requisition'}
                </button>
            </div>

            {showCreate && (
                <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-card)' }}>
                    <h4 className="font-bold" style={{ marginBottom: '1rem' }}>Select Approved Requisition</h4>
                    {approvedReqs.length === 0 ? (
                        <p className="text-sm text-gray-500">No approved requisitions available to post.</p>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {approvedReqs.map(req => (
                                <div key={req.id} className="card" style={{ padding: '1rem', background: 'var(--bg-card)' }}>
                                    <p className="font-bold text-sm">{req.title}</p>
                                    <p className="text-xs text-gray-500">{req.reqNumber} • {req.department}</p>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: '0.5rem', fontSize: '0.75rem' }}
                                        onClick={() => handleCreatePosting(req.id)}
                                    >
                                        Create Posting
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Job Title</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Req #</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Created</th>
                            <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>Loading postings...</td></tr>
                        ) : postings.length === 0 ? (
                            <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }}>No job postings yet.</td></tr>
                        ) : (
                            postings.map((post) => (
                                <tr key={post.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{post.title}</td>
                                    <td style={{ padding: '1rem' }}>{post.requisition?.reqNumber}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            color: post.status === 'ACTIVE' ? 'var(--accent-teal)' : 'var(--slate-500)'
                                        }}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {post.status === 'DRAFT' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(post.id, 'ACTIVE')}
                                                    style={{ color: 'var(--primary-600)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                >
                                                    Publish
                                                </button>
                                            )}
                                            {post.status === 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(post.id, 'PAUSED')}
                                                    style={{ color: 'var(--accent-amber)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                >
                                                    Pause
                                                </button>
                                            )}
                                            {post.status !== 'CLOSED' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(post.id, 'CLOSED')}
                                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                                                >
                                                    Close
                                                </button>
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
