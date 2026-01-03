'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HRAnalytics() {
    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h3 className="text-xl font-bold">HR Operations Analytics</h3>
                    <p className="text-sm text-gray-500">Deep dive into demographics, recruitment, and attendance patterns.</p>
                </div>
                <button className="btn">Download Full Export</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Headcount by Department</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { name: 'Engineering', count: 42, pct: 40 },
                            { name: 'Operations', count: 28, pct: 25 },
                            { name: 'Sales', count: 20, pct: 18 },
                            { name: 'HR', count: 5, pct: 5 },
                        ].map((d, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                    <span>{d.name}</span>
                                    <span style={{ fontWeight: 700 }}>{d.count}</span>
                                </div>
                                <div style={{ height: '4px', background: 'var(--slate-100)', borderRadius: '2px' }}>
                                    <div style={{ width: `${d.pct}%`, height: '100%', background: 'var(--primary-500)' }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Gender Diversity</h4>
                    <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '50%', border: '15px solid var(--primary-500)', borderTopColor: 'var(--accent-teal)' }}>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.8rem' }}>60/40</p>
                                <p style={{ margin: 0, fontSize: '0.5rem', color: 'var(--slate-400)' }}>M/F</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-sm font-bold" style={{ marginBottom: '1rem' }}>Tenure Distribution</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: '< 1 Year', value: '15%' },
                            { label: '1 - 3 Years', value: '45%' },
                            { label: '3 - 5 Years', value: '30%' },
                            { label: '5+ Years', value: '10%' },
                        ].map((t, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                <span style={{ color: 'var(--slate-500)' }}>{t.label}</span>
                                <span style={{ fontWeight: 700 }}>{t.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                <h4 className="text-lg font-bold" style={{ marginBottom: '1rem' }}>Recruitment Velocity (Time-to-Hire)</h4>
                <div style={{ height: '250px', background: 'white', borderRadius: '8px', padding: '1rem' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={[
                                { role: 'Senior Engineer', days: 45 },
                                { role: 'Product Manager', days: 38 },
                                { role: 'Marketing Specialist', days: 25 },
                                { role: 'Sales Rep', days: 20 },
                                { role: 'Customer Support', days: 12 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="role" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '8px', padding: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar dataKey="days" name="Days to Hire" fill="var(--accent-teal)" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
