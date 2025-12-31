'use client';

import React, { useState } from 'react';
import { approveLeaveRequestManager, approveLeaveRequestHR, rejectLeaveRequest } from '@/lib/actions/leave';

interface LeaveRequest {
    id: string;
    employee: { firstName: string, lastName: string };
    leaveType: { name: string };
    startDate: Date;
    endDate: Date;
    daysRequested: number;
    status: string;
    managerApprovalStatus: string;
    hrApprovalStatus: string;
    reason: string | null;
}

export default function LeaveApprovalList({
    requests,
    role,
    userId
}: {
    requests: LeaveRequest[],
    role: 'MANAGER' | 'HR',
    userId: string
}) {
    const [loading, setLoading] = useState<string | null>(null);

    async function handleApprove(id: string) {
        setLoading(id);
        if (role === 'MANAGER') {
            await approveLeaveRequestManager(id, 'Approved by Manager');
        } else {
            await approveLeaveRequestHR(id, 'Approved by HR', userId);
        }
        setLoading(null);
    }

    async function handleReject(id: string) {
        setLoading(id);
        const comment = window.prompt('Reason for rejection?');
        if (comment) {
            await rejectLeaveRequest(id, comment, role);
        }
        setLoading(null);
    }

    const filteredRequests = requests.filter(req => {
        if (role === 'MANAGER') {
            return req.managerApprovalStatus === 'PENDING' && req.status === 'PENDING';
        }
        return req.managerApprovalStatus === 'APPROVED' && req.hrApprovalStatus === 'PENDING';
    });

    return (
        <div>
            <h3 className="text-lg font-bold mb-4">{role} Queue ({filteredRequests.length} Pending)</h3>
            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: 'var(--slate-50)', borderBottom: '1px solid var(--slate-200)' }}>
                            <th style={{ padding: '1rem' }}>Employee</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>Dates</th>
                            <th style={{ padding: '1rem' }}>Days</th>
                            <th style={{ padding: '1rem' }}>Reason</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length === 0 ? (
                            <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}>No requests in queue.</td></tr>
                        ) : (
                            filteredRequests.map(req => (
                                <tr key={req.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 600 }}>{req.employee.firstName} {req.employee.lastName}</td>
                                    <td style={{ padding: '1rem' }}>{req.leaveType.name}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.8rem' }}>
                                        {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: '1rem' }}>{req.daysRequested}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.8rem', maxWidth: '200px' }}>{req.reason}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                disabled={loading === req.id}
                                                className="btn btn-primary"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(req.id)}
                                                disabled={loading === req.id}
                                                className="btn"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: '1px solid #ef4444', color: '#ef4444' }}
                                            >
                                                Reject
                                            </button>
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
