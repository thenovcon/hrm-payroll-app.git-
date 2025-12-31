'use client';

import React from 'react';

export default function ExecutiveDashboard() {
    const kpis = [
        { label: 'Total Headcount', value: '124', trend: '+4', trendType: 'up' },
        { label: 'Payroll Cost (MTD)', value: 'GHS 425,000', trend: '+2.4%', trendType: 'up' },
        { label: 'Absenteeism Rate', value: '3.2%', trend: '-0.5%', trendType: 'down' },
        { label: 'Attrition Rate (YTD)', value: '4.8%', trend: '-1.2%', trendType: 'down' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {kpis.map((kpi, i) => (
                    <div key={i} className="card" style={{ padding: '1.25rem' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', margin: 0 }}>{kpi.label}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '0.25rem' }}>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{kpi.value}</h4>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: kpi.trendType === 'up' ? '#ef4444' : 'var(--accent-teal)'
                            }}>{kpi.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Workforce Growth & Cost Trend</h4>
                    <div style={{ height: '300px', background: 'var(--slate-50)', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '1rem' }}>
                        {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ height: `${h}%`, background: 'var(--primary-500)', borderRadius: '4px 4px 0 0' }}></div>
                                <span style={{ fontSize: '0.65rem', textAlign: 'center', color: 'var(--slate-400)' }}>M{i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h4 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Risk & Health Alerts</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { label: 'Unused Leave Liability', value: 'GHS 12,400', level: 'Action Required', color: '#ef4444' },
                            { label: 'Compliance Gap (Safety)', value: '12 Employees', level: 'High Risk', color: '#f59e0b' },
                            { label: 'Pending Appraisals', value: '8 Delayed', level: 'Review Pending', color: 'var(--primary-500)' },
                        ].map((r, i) => (
                            <div key={i} style={{ padding: '1rem', border: '1px solid var(--slate-100)', borderRadius: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, margin: 0 }}>{r.label}</p>
                                    <span style={{ fontWeight: 800 }}>{r.value}</span>
                                </div>
                                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: r.color, textTransform: 'uppercase' }}>{r.level}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
