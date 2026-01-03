'use client';

import React, { useEffect, useState } from 'react';
import { getPayrollRuns, createPayrollRun, updatePayrollStatus } from '@/lib/actions/payroll-actions';
import { format } from 'date-fns';

import { useRouter } from 'next/navigation';

export default function PayrollRunManager() {
    const router = useRouter();
    const [runs, setRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedRun, setSelectedRun] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
        const result = await getPayrollRuns();
        if (result.success) setRuns(result.data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateRun = async () => {
        setProcessing(true);
        const now = new Date();
        const result = await createPayrollRun(now.getMonth() + 1, now.getFullYear());
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
        setProcessing(false);
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const result = await updatePayrollStatus(id, status);
        if (result.success) fetchData();
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading payroll history...</div>;

    if (selectedRun) {
        return (
            <div style={{ padding: '1.5rem' }}>
                <button className="btn" onClick={() => setSelectedRun(null)} style={{ marginBottom: '1.5rem' }}>← Back to Runs</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h3 className="text-xl font-bold">Payroll Review: {format(new Date(selectedRun.year, selectedRun.month - 1), 'MMMM yyyy')}</h3>
                        <p className="text-sm text-gray-500">Status: <span style={{ fontWeight: 700, color: selectedRun.status === 'DRAFT' ? '#f59e0b' : 'var(--accent-teal)' }}>{selectedRun.status}</span></p>
                    </div>
                    {selectedRun.status === 'DRAFT' && (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => handleUpdateStatus(selectedRun.id, 'APPROVED')} className="btn btn-primary" style={{ background: 'var(--accent-teal)' }}>Approve Run</button>
                            <button className="btn" style={{ background: 'rgba(220, 38, 38, 0.1)', color: '#dc2626' }}>Rollback</button>
                        </div>
                    )}
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Employee</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Basic</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Allow/Bonus</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>SSNIT (5.5%)</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>PAYE Tax</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Net Pay</th>
                                <th style={{ padding: '1rem', fontSize: '0.875rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedRun.payslips.map((slip: any) => (
                                <tr key={slip.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: 600 }}>{slip.employee?.firstName} {slip.employee?.lastName}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{slip.employee?.employeeId}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>GHS {slip.basicSalary.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>GHS {slip.totalAllowances.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', color: '#ef4444' }}>-GHS {slip.ssnitEmployee.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', color: '#ef4444' }}>-GHS {slip.incomeTax.toLocaleString()}</td>
                                    <td style={{ padding: '1rem', fontWeight: 700 }}>GHS {slip.netPay.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <button className="btn" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>View Payslip</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">Payroll Runs</h2>
                    <p className="text-sm text-slate-500">History of all payroll generation cycles.</p>
                </div>
                <button
                    onClick={() => router.push('/payroll/run')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                >
                    <span>+</span> Run Payroll
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {runs.length === 0 ? (
                    <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                        <p style={{ color: 'var(--slate-500)' }}>No payroll runs processed yet. Click the button above to start the first monthly run.</p>
                    </div>
                ) : (
                    runs.map((run) => (
                        <div
                            key={run.id}
                            className="card"
                            style={{
                                padding: '1.25rem',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                                alignItems: 'center',
                                gap: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => setSelectedRun(run)}
                        >
                            <div>
                                <h4 style={{ fontWeight: 700 }}>{format(new Date(run.year, run.month - 1), 'MMMM yyyy')}</h4>
                                <span className="badge" style={{
                                    background: run.status === 'PAID' ? 'var(--accent-teal)20' : '#f59e0b20',
                                    color: run.status === 'PAID' ? 'var(--accent-teal)' : '#f59e0b',
                                    marginTop: '0.25rem'
                                }}>
                                    {run.status}
                                </span>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Net Pay</p>
                                <p style={{ fontWeight: 600 }}>GHS {run.totalNetPay.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Cost to Co.</p>
                                <p style={{ fontWeight: 600 }}>GHS {run.totalCost.toLocaleString()}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Employee Count</p>
                                <p style={{ fontWeight: 600 }}>{run.payslips?.length || 0} Staff</p>
                            </div>
                            <button className="btn" style={{ padding: '0.5rem 1rem' }}>Review Details</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
