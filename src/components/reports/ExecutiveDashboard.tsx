'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    LineChart, Line, AreaChart, Area
} from 'recharts';

export default function ExecutiveDashboard() {
    // Realistic Dummy Data (matching Seed Logic)
    const overviewData = [
        { metric: 'Total Headcount', value: '174', target: '200', variance: '-13%', status: 'Behind' },
        { metric: 'Payroll Cost (MTD)', value: 'GHS 425,000', target: 'GHS 400,000', variance: '+6.2%', status: 'Warning' },
        { metric: 'Attrition Rate (YTD)', value: '4.8%', target: '5.0%', variance: '-0.2%', status: 'On Track' },
        { metric: 'Absenteeism', value: '3.2%', target: '2.5%', variance: '+0.7%', status: 'Action Required' },
        { metric: 'Open Requisitions', value: '12', target: '10', variance: '+2', status: 'Active' },
    ];

    const payrollTrend = [
        { name: 'Jan', cost: 120000, headcount: 140 },
        { name: 'Feb', cost: 125000, headcount: 142 },
        { name: 'Mar', cost: 128000, headcount: 145 },
        { name: 'Apr', cost: 135000, headcount: 150 },
        { name: 'May', cost: 142000, headcount: 155 },
        { name: 'Jun', cost: 140000, headcount: 160 }, // Dip due to exits?
        { name: 'Jul', cost: 155000, headcount: 174 },
    ];

    const deptDistribution = [
        { name: 'Engineering', count: 45 },
        { name: 'Sales', count: 35 },
        { name: 'Operations', count: 40 },
        { name: 'HR', count: 12 },
        { name: 'Finance', count: 18 },
        { name: 'Marketing', count: 24 },
    ];

    return (
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* 1. Executive Overview Table */}
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-subtle)' }}>
                    <h3 className="text-lg font-bold">Executive Overview</h3>
                    <p className="text-sm text-gray-500">Key Performance Indicators vs Targets</p>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ background: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}>
                        <tr>
                            <th style={{ padding: '1rem', textAlign: 'left' }}>Metric</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Current Value</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Target</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Variance</th>
                            <th style={{ padding: '1rem', textAlign: 'center' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overviewData.map((row, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{row.metric}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700 }}>{row.value}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', color: 'var(--text-secondary)' }}>{row.target}</td>
                                <td style={{
                                    padding: '1rem', textAlign: 'right',
                                    color: row.variance.startsWith('+') && row.status !== 'Active' ? '#ef4444' : '#22c55e',
                                    fontWeight: 600
                                }}>
                                    {row.variance}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700,
                                        background: row.status === 'On Track' ? 'rgba(34, 197, 94, 0.1)' :
                                            row.status === 'Warning' ? 'rgba(245, 158, 11, 0.1)' :
                                                row.status === 'Action Required' ? 'rgba(239, 68, 68, 0.1)' : 'var(--primary-100)',
                                        color: row.status === 'On Track' ? '#16a34a' :
                                            row.status === 'Warning' ? '#d97706' :
                                                row.status === 'Action Required' ? '#dc2626' : 'var(--primary-700)'
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 2. Visualizations */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>

                {/* Payroll Trend */}
                <div className="card" style={{ padding: '1.5rem', height: '400px' }}>
                    <h4 className="font-bold mb-4">Payroll Cost Trend (GHS)</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={payrollTrend}>
                            <defs>
                                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary-500)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--primary-500)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                            <RechartsTooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '8px' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Area type="monotone" dataKey="cost" stroke="var(--primary-600)" fillOpacity={1} fill="url(#colorCost)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Headcount by Dept */}
                <div className="card" style={{ padding: '1.5rem', height: '400px' }}>
                    <h4 className="font-bold mb-4">Headcount Distribution</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deptDistribution} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-light)" />
                            <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={100} />
                            <RechartsTooltip cursor={{ fill: 'var(--bg-subtle)' }} />
                            <Bar dataKey="count" fill="var(--accent-teal)" radius={[0, 4, 4, 0]} barSize={24} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
