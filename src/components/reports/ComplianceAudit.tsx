'use client';

import React from 'react';

export default function ComplianceAudit() {
    const documents = [
        { name: 'Monthly PAYE Summary (GRA)', period: 'March 2024', status: 'Generated', type: 'Tax' },
        { name: 'SSNIT Tier 1 Contribution Schedule', period: 'March 2024', status: 'Ready to File', type: 'Pension' },
        { name: 'Annual Tax Certificates (P9)', period: '2023 FY', status: 'Distributed', type: 'Tax' },
        { name: 'Tier 2 Remittance Report', period: 'March 2024', status: 'Pending Approval', type: 'Pension' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Compliance & Statutory Reporting</h3>
                    <p className="text-sm text-gray-500">Generate Ghana-ready statutory outputs and monitor audit trails.</p>
                </div>
                <button className="btn btn-primary">Bulk Generate Statutory Files</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
                            <th style={{ padding: '1rem' }}>Document Name</th>
                            <th style={{ padding: '1rem' }}>Period</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((d, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--slate-50)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{d.name}</td>
                                <td style={{ padding: '1rem' }}>{d.period}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.65rem',
                                        fontWeight: 700,
                                        background: d.status === 'Generated' || d.status === 'Distributed' ? 'var(--accent-teal)10' : 'var(--slate-100)',
                                        color: d.status === 'Generated' || d.status === 'Distributed' ? 'var(--accent-teal)' : 'var(--slate-600)',
                                    }}>{d.status}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>{d.type}</td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Download PDF</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginTop: '2rem' }}>
                <h4 className="text-lg font-bold" style={{ marginBottom: '1rem' }}>Recent Audit Trail</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                        { action: 'Payroll Approved', user: 'Admin (David)', time: '2 hours ago', meta: 'March 2024 Cycle' },
                        { action: 'Employee Record Updated', user: 'HR (Alice)', time: '5 hours ago', meta: 'Bank Details changed for EMP042' },
                        { action: 'Statutory Export Generated', user: 'System', time: 'Yesterday', meta: 'GRA PAYE Text File' },
                    ].map((a, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <div>
                                <span style={{ fontWeight: 700 }}>{a.action}</span>
                                <span style={{ color: 'var(--slate-400)', margin: '0 0.5rem' }}>•</span>
                                <span style={{ color: 'var(--slate-600)' }}>{a.user}</span>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--slate-400)' }}>{a.meta}</p>
                            </div>
                            <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>{a.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
