'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PayrollAnalytics() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">Payroll & Cost Intelligence</h3>
                    <p className="text-sm text-gray-500">Track spending, overtime anomalies, and cost center efficiency.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-primary">Run Projection</button>
                    <button className="btn">Variance Report</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Budget vs. Actual Payroll (6 Months)</h4>
                    <div style={{ height: '250px', position: 'relative', padding: '0.5rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={[
                                    { month: 'Jan', budget: 50000, actual: 48000 },
                                    { month: 'Feb', budget: 50000, actual: 51000 },
                                    { month: 'Mar', budget: 52000, actual: 52500 },
                                    { month: 'Apr', budget: 52000, actual: 51000 },
                                    { month: 'May', budget: 55000, actual: 54000 },
                                    { month: 'Jun', budget: 55000, actual: 58000 },
                                ]}
                                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary-600)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--primary-600)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    formatter={(value: any) => [`GH₵${Number(value || 0).toLocaleString()}`, '']}
                                />
                                <Area type="monotone" dataKey="actual" stroke="var(--primary-600)" fillOpacity={1} fill="url(#colorActual)" name="Actual" />
                                <Area type="monotone" dataKey="budget" stroke="#cbd5e1" strokeDasharray="5 5" fill="none" name="Budget" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', background: '#cbd5e1', border: '1px dashed #94a3b8' }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Budgeted</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '12px', height: '12px', background: 'var(--primary-600)' }}></div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Actual Spent</span>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Cost Center Allocation</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'Admin & HQ', value: '35%', color: 'var(--primary-500)' },
                            { name: 'Direct Labor', value: '45%', color: 'var(--accent-teal)' },
                            { name: 'Sales Commissions', value: '12%', color: '#f59e0b' },
                            { name: 'Other Benefits', value: '8%', color: 'var(--slate-400)' },
                        ].map((c, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>{c.name}</span>
                                    <span style={{ fontWeight: 700 }}>{c.value}</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                                    <div style={{ width: c.value, height: '100%', background: c.color, borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
