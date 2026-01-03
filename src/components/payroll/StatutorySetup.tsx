'use client';

import React, { useState, useTransition } from 'react';
import { getPayrollSettings, updatePayrollSettings } from '@/lib/actions/payroll-actions';
import { TAX_BRACKETS } from '@/lib/payroll/taxRates';

export default function StatutorySetup() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    React.useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const result = await getPayrollSettings();
            if (result.success) setSettings(result.data);
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleSave = async (formData: FormData) => {
        const data = {
            ssnitEmployeeRate: parseFloat(formData.get('ssnitEmployeeRate') as string),
            ssnitEmployerRate: parseFloat(formData.get('ssnitEmployerRate') as string),
            tier3Enabled: formData.get('tier3Enabled') === 'on',
            tier3EmployeeRate: parseFloat(formData.get('tier3EmployeeRate') as string),
            tier3EmployerRate: parseFloat(formData.get('tier3EmployerRate') as string),
        };

        startTransition(async () => {
            const res = await updatePayrollSettings(data);
            if (res.success) {
                alert('Settings updated successfully!');
                setSettings(res.data);
            } else {
                alert('Failed to update settings.');
            }
        });
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading statutory settings...</div>;

    return (
        <form action={handleSave} style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Ghana Statutory Configuration</h3>
                    <p className="text-sm text-gray-500">Regulated tax brackets and pension contribution rates.</p>
                </div>
                <button type="submit" disabled={isPending} className="btn btn-primary">
                    {isPending ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                {/* Pension Rates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h4 style={{ marginBottom: '1.5rem', fontWeight: 600 }}>Tier 1 & 2 (Mandatory)</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="label">SSNIT Tier 1 (Employee %)</label>
                                <input name="ssnitEmployeeRate" type="number" step="0.1" className="input" defaultValue={settings?.ssnitEmployeeRate} />
                            </div>
                            <div>
                                <label className="label">SSNIT Tier 1 (Employer %)</label>
                                <input name="ssnitEmployerRate" type="number" step="0.1" className="input" defaultValue={settings?.ssnitEmployerRate} />
                            </div>
                            <div style={{ height: '1px', background: 'var(--slate-100)', margin: '0.5rem 0' }}></div>
                            <div>
                                <label className="label">Tier 2 (Occupational %)</label>
                                <input type="number" className="input" defaultValue="5.0" readOnly style={{ background: 'var(--slate-50)' }} />
                                <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>Fixed at 5% by NPRA.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', border: settings?.tier3Enabled ? '2px solid var(--primary-500)' : '1px solid var(--slate-200)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 600 }}>Tier 3 (Provident Fund)</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    name="tier3Enabled"
                                    id="tier3"
                                    defaultChecked={settings?.tier3Enabled}
                                    style={{ width: '1.25rem', height: '1.25rem' }}
                                />
                                <label htmlFor="tier3" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Enable</label>
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>
                            Voluntary contributions. Tax-exempt up to 16.5% of basic salary.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label className="label">Employee Contribution (%)</label>
                                <input name="tier3EmployeeRate" type="number" step="0.1" className="input" defaultValue={settings?.tier3EmployeeRate || 0} />
                            </div>
                            <div>
                                <label className="label">Employer Contribution (%)</label>
                                <input name="tier3EmployerRate" type="number" step="0.1" className="input" defaultValue={settings?.tier3EmployerRate || 0} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PAYE Brackets */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: 600 }}>PAYE Tax Brackets (GRA 2025)</h4>
                        <div style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--green-100)', color: 'var(--green-700)', borderRadius: '4px' }}>Active</div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--slate-50)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Taxable Band (GHS)</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right' }}>Rate %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TAX_BRACKETS.map((b, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                                        {b.limit === Infinity ? 'Exceeding' : `First/Next ${b.limit.toLocaleString()}`}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right', fontWeight: 600 }}>{(b.rate * 100).toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--primary-50)', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--primary-800)', fontWeight: 600, margin: 0 }}>Calculation Order</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--primary-700)', margin: '0.25rem 0 0 0' }}>
                                SSNIT (Tier 1) and PF (Tier 3) are deducted from Gross Income <strong>before</strong> tax is calculated.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
