'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';

export default function FunnelChart({ data }: { data: { stage: string, count: number }[] }) {
    // Calculate conversion rates for tooltip or label
    // For simplicity, we just visualize the funnel as a Bar Chart sorted descending (Funnel shape-ish)

    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="stage"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'][index]} />
                        ))}
                        <LabelList dataKey="count" position="right" fill="#64748b" fontSize={13} fontWeight={600} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
