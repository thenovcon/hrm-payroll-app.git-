'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function JobStatsChart({
    views = 3342,
    applied = 77,
    data = [50, 62, 70, 58, 44, 57, 63, 77, 66, 57, 50, 72]
}: { views?: number, applied?: number, data?: number[] }) {

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Transform data for Recharts
    const chartData = data.map((val, i) => ({
        name: months[i],
        applicants: val,
        // Mock view data relative to applications for visualisation
        views: Math.round(val * 1.5)
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Job Statistics</h3>
                    <p className="text-sm text-slate-400">Application trends over time</p>
                </div>
                <div className="flex gap-4 text-sm items-center">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-purple-100 rounded-sm"></span>
                        <span className="text-slate-500">Job View</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-primary-600 rounded-sm"></span>
                        <span className="text-slate-500">Job Applied</span>
                    </div>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 outline-none text-xs font-semibold ml-2">
                        <option>This Year</option>
                        <option>Last Year</option>
                    </select>
                </div>
            </div>

            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        barGap={0}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />

                        {/* Background Bar (Views - representing scale) */}
                        <Bar dataKey="views" fill="#f3e8ff" radius={[4, 4, 0, 0]} barSize={32} />

                        {/* Foreground Bar (Applicants) */}
                        <Bar dataKey="applicants" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 7 ? '#2563eb' : '#3b82f6'} fillOpacity={index === 7 ? 1 : 0.7} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
