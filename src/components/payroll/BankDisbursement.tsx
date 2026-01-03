'use client';

import React, { useState } from 'react';
import { exportBankDisbursement } from '@/lib/actions/payroll-actions';

export default function BankDisbursement() {
    const [runId, setRunId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!runId) return alert('Please enter a Run ID');
        setLoading(true);
        const result = await exportBankDisbursement(runId);
        if (result.success && result.data) {
            const blob = new Blob([result.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `Bank_Disbursement_${runId}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">Bank Disbursement Console</h3>
                <p className="text-sm text-gray-500">Export payment files for bank transfers and Mobile Money (MoMo) bulk payments.</p>
            </div>

            <div className="card" style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-subtle)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Generate Bulk Payment File</h4>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem' }}>
                    Select a finalized payroll run to generate the CSV file compatible with Standard Chartered, Ecobank, and Mobile Money portals.
                </p>

                <div style={{ maxWidth: '400px', margin: '0 auto 1.5rem auto', textAlign: 'left' }}>
                    <label className="label">Payroll Run ID</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter Run UUID..."
                        value={runId}
                        onChange={(e) => setRunId(e.target.value)}
                        style={{ background: 'var(--bg-card)' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                    <button onClick={handleDownload} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                        {loading ? 'Generating...' : 'Download CSV (Standard)'}
                    </button>
                    <button className="btn" style={{ padding: '0.75rem 2rem', background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
                        Request API Integration
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h5 style={{ fontWeight: 600, marginBottom: '1rem' }}>Supported Formats</h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.75rem' }}>
                        <strong>Bank CSV</strong>: Standard format for multi-bank processing.
                    </div>
                    <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.75rem' }}>
                        <strong>MoMo XML</strong>: Direct upload for MTN and Telecel bulk payment.
                    </div>
                    <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '0.75rem' }}>
                        <strong>SWIFT/MT103</strong>: International wire transfer compatibility.
                    </div>
                </div>
            </div>
        </div>
    );
}
