'use client';

import React from 'react';

export default function UserRoles() {
    const roles = [
        { name: 'Super Admin', users: 2, scopes: 'Global', status: 'System' },
        { name: 'HR Manager', users: 5, scopes: 'Departmental', status: 'Custom' },
        { name: 'Payroll Specialist', users: 3, scopes: 'Payroll Only', status: 'Custom' },
        { name: 'Line Manager', users: 24, scopes: 'Team Level', status: 'Standard' },
        { name: 'Employee', users: 156, scopes: 'Self Service', status: 'System' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Roles & Permissions</h3>
                    <p className="text-sm text-gray-500">Configure granular access control and data visibility rules.</p>
                </div>
                <button className="btn btn-primary">+ Create Custom Role</button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--slate-100)', background: 'var(--slate-50)' }}>
                            <th style={{ padding: '1rem' }}>Role Name</th>
                            <th style={{ padding: '1rem' }}>Assigned Users</th>
                            <th style={{ padding: '1rem' }}>Visibility Scope</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--slate-50)' }}>
                                <td style={{ padding: '1rem', fontWeight: 700 }}>{r.name}</td>
                                <td style={{ padding: '1rem' }}>{r.users} Users</td>
                                <td style={{ padding: '1rem' }}>{r.scopes}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        background: r.status === 'System' ? 'var(--primary-100)' : 'var(--slate-100)',
                                        color: r.status === 'System' ? 'var(--primary-700)' : 'var(--slate-600)',
                                        fontWeight: 700
                                    }}>{r.status}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>Edit Permissions</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginTop: '2rem', border: '1px dashed var(--slate-200)' }}>
                <h4 className="text-sm font-bold text-gray-400" style={{ textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Advanced Security Settings</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    {[
                        { label: 'Multi-Factor Auth', status: 'Enforced' },
                        { label: 'Password Expiry', status: '90 Days' },
                        { label: 'Session Timeout', status: '30 Mins' },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--slate-50)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.label}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 700 }}>{s.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
