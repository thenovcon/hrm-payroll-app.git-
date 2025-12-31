'use client';

import React, { useEffect, useState } from 'react';
import { getPayrollSettings } from '@/lib/actions/payroll-actions';

export default function StatutorySetup() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const result = await getPayrollSettings();
            if (result.success) setSettings(result.data);
            setLoading(false);
        }
        fetchSettings();
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading statutory settings...</div>;

    const brackets = [
        { label: 'First GHS 490', rate: '0%' },
        { label: 'Next GHS 110', rate: '5%' },
        { label: 'Next GHS 130', rate: '10%' },
        { label: 'Next GHS 3,165', rate: '17.5%' },
        { label: 'Next GHS 16,105', rate: '25%' },
        { label: 'Next GHS 35,000', rate: '30%' },
        { label: 'Above GHS 55,000', rate: '35%' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h3 className="text-xl font-bold">Ghana Statutory Configuration</h3>
                <p className="text-sm text-gray-500">Regulated tax brackets and pension contribution rates for the current fiscal year.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Pension Rates */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Pension (SSNIT) Rates</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="label">SSNIT Tier 1 (Employee %)</label>
                            <input type="number" className="input" defaultValue={settings?.ssnitEmployeeRate || 5.5} readOnly style={{ background: 'var(--slate-50)' }} />
                        </div>
                        <div>
                            <label className="label">SSNIT Tier 1 (Employer %)</label>
                            <input type="number" className="input" defaultValue={settings?.ssnitEmployerRate || 13.0} readOnly style={{ background: 'var(--slate-50)' }} />
                        </div>
                        <div style={{ height: '1px', background: 'var(--slate-100)', margin: '0.5rem 0' }}></div>
                        <div>
                            <label className="label">Tier 2 (Occupational %)</label>
                            <input type="number" className="input" defaultValue="5.0" readOnly style={{ background: 'var(--slate-50)' }} />
                            <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Mandatory contribution to private scheme.</p>
                        </div>
                    </div>
                </div>

                {/* PAYE Brackets */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: 600 }}>PAYE Tax Brackets (2024 Index)</h4>
                        <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', border: '1px solid var(--slate-200)' }}>Request Revision</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Taxable Band (GHS)</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right' }}>Rate %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brackets.map((b, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{b.label}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right', fontWeight: 600 }}>{b.rate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--primary-50)', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--primary-800)', fontWeight: 600, margin: 0 }}>Calculation Order</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--primary-700)', margin: '0.25rem 0 0 0' }}>
                                SSNIT is deducted from Gross before PAYE is calculated. This ensures employees are not taxed on their pension contributions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
