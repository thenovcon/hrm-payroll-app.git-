'use client';

import React, { useState } from 'react';
import { generateComplianceData } from '@/lib/actions/payroll-actions';

export default function ComplianceReports() {
    const [runId, setRunId] = useState('');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!runId) return alert('Please enter a Run ID (or select from list in production)');
        setLoading(true);
        const result = await generateComplianceData(runId);
        if (result.success) setData(result.data);
        else alert(result.error);
        setLoading(false);
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">Statutory & Compliance Reporting</h3>
                <p className="text-sm text-gray-500">Generate monthly returns for GRA (PAYE) and SSNIT contributions.</p>
            </div>

            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                    <label className="label">Select Payroll Period (Run ID)</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter Run UUID..."
                        value={runId}
                        onChange={(e) => setRunId(e.target.value)}
                    />
                </div>
                <button onClick={handleGenerate} className="btn btn-primary" style={{ height: '42px' }}>
                    {loading ? 'Crunching Numbers...' : 'Pull Report Data'}
                </button>
            </div>

            {data && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {/* GRA Section */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontWeight: 700 }}>GRA - PAYE Summary</h4>
                            <span className="badge" style={{ background: 'var(--accent-teal)20', color: 'var(--accent-teal)' }}>P.A.Y.E Form</span>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--slate-500)' }}>Employee Count:</span>
                                <span style={{ fontWeight: 600 }}>{data.count}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--slate-500)' }}>Total Taxable Income:</span>
                                <span style={{ fontWeight: 600 }}>GHS {data.gra.taxableIncome.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-100)', paddingTop: '0.5rem' }}>
                                <span style={{ color: 'var(--primary-900)', fontWeight: 700 }}>Total PAYE Remittance:</span>
                                <span style={{ color: 'var(--primary-900)', fontWeight: 700 }}>GHS {data.gra.incomeTax.toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="btn" style={{ width: '100%', marginTop: '1.5rem', border: '1px solid var(--slate-200)' }}>Download GRA Excel Template</button>
                    </div>

                    {/* SSNIT Section */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontWeight: 700 }}>SSNIT - Contribution Summary</h4>
                            <span className="badge" style={{ background: 'var(--primary-50)', color: 'var(--primary-700)' }}>Tier 1 & 2</span>
                        </div>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--slate-500)' }}>Employee (5.5%):</span>
                                <span style={{ fontWeight: 600 }}>GHS {data.ssnit.ssnitEmployee.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--slate-500)' }}>Employer (13%):</span>
                                <span style={{ fontWeight: 600 }}>GHS {data.ssnit.ssnitEmployer.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--slate-100)', paddingTop: '0.5rem' }}>
                                <span style={{ color: 'var(--primary-900)', fontWeight: 700 }}>Total SSNIT Payable:</span>
                                <span style={{ color: 'var(--primary-900)', fontWeight: 700 }}>GHS {data.ssnit.total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button className="btn" style={{ width: '100%', marginTop: '1.5rem', border: '1px solid var(--slate-200)' }}>Download SSNIT csv Format</button>
                    </div>
                </div>
            )}
        </div>
    );
}
