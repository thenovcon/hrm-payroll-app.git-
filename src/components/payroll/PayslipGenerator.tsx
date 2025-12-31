'use client';

import React, { useState } from 'react';

export default function PayslipGenerator() {
    const [runId, setRunId] = useState('');
    const [loading, setLoading] = useState(false);
    const [distributed, setDistributed] = useState(false);

    const handleDistribute = () => {
        if (!runId) return alert('Please enter a Run ID');
        setLoading(true);
        // Simulate distribution
        setTimeout(() => {
            setDistributed(true);
            setLoading(false);
        }, 1500);
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">Payslip Center</h3>
                <p className="text-sm text-gray-500">Generate, preview, and distribute digital payslips to employee self-service portals.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Batch Distribution</h4>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label className="label">Select Payroll Run</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="Enter Run UUID..."
                                value={runId}
                                onChange={(e) => setRunId(e.target.value)}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn" style={{ flex: 1, border: '1px solid var(--slate-200)' }}>Preview Sample</button>
                            <button onClick={handleDistribute} className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                                {loading ? 'Sending to Portals...' : 'Distribute Payslips'}
                            </button>
                        </div>
                        {distributed && (
                            <div style={{ padding: '1rem', background: 'var(--accent-teal)20', borderRadius: '8px', color: 'var(--accent-teal)', fontSize: '0.875rem', fontWeight: 600 }}>
                                ✅ Successfully distributed to 124 employees for the selected period.
                            </div>
                        )}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Individual Payslip Search</h4>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input type="text" className="input" placeholder="Search Employee ID..." />
                        <button className="btn btn-primary">Find</button>
                    </div>
                    <div style={{ marginTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Quick Actions</p>
                        <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button className="btn" style={{ fontSize: '0.75rem', textAlign: 'left', background: 'var(--slate-50)', padding: '0.75rem' }}>🖨️ Print Employee Batch (PDF)</button>
                            <button className="btn" style={{ fontSize: '0.75rem', textAlign: 'left', background: 'var(--slate-50)', padding: '0.75rem' }}>📧 Email Unsent Payslips</button>
                            <button className="btn" style={{ fontSize: '0.75rem', textAlign: 'left', background: 'var(--slate-50)', padding: '0.75rem' }}>🔐 Set PDF Password Rule</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 600 }}>Distribution Log</h4>
                    <button className="btn" style={{ fontSize: '0.75rem' }}>Clear Log</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Date</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Period</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Method</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Recipients</th>
                            <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>Nov 28, 2024</td>
                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>Nov 2024</td>
                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>Email & Portal</td>
                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>142</td>
                            <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                <span className="badge" style={{ background: 'var(--accent-teal)20', color: 'var(--accent-teal)' }}>Success</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
