
'use client';

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

// Theme Colors (Tailwind/Shadcn alignment)
const COLORS = {
    primary: '#2563eb', // blue-600
    secondary: '#64748b', // slate-500
    accent: '#f59e0b', // amber-500
    success: '#22c55e', // green-500
    danger: '#ef4444', // red-500
    background: '#ffffff',
    grid: '#e2e8f0', // slate-200
    slice1: '#3b82f6', // blue-500
    slice2: '#06b6d4', // cyan-500
    slice3: '#8b5cf6', // violet-500
    slice4: '#ec4899', // pink-500
    slice5: '#10b981', // emerald-500
};

export default function OverviewAnalytics({
    payrollHistory,
    headcountByDept,
    attendanceTrends
}: {
    payrollHistory: any[],
    headcountByDept: any[],
    attendanceTrends: any[]
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* 1. Payroll Cost Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800">Payroll Cost History</h3>
                    <p className="text-sm text-slate-500">Gross Salary + Employer Contributions (Last 3 Months)</p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={payrollHistory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: COLORS.secondary, fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: COLORS.secondary, fontSize: 12 }}
                                tickFormatter={(val) => `GH₵${val / 1000}k`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Bar
                                dataKey="cost"
                                fill={COLORS.primary}
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                animationDuration={1500}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 2. Headcount Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800">Headcount by Department</h3>
                    <p className="text-sm text-slate-500">Distribution of workforce across units</p>
                </div>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={headcountByDept}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {headcountByDept.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[7 + (index % 5)]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                iconType="circle"
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Attendance Trends */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
                <div className="mb-4">
                    <h3 className="font-bold text-slate-800">Attendance Trends (Last 14 Days)</h3>
                    <p className="text-sm text-slate-500">Daily presence and punctuality metrics</p>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={attendanceTrends}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                                tick={{ fill: COLORS.secondary, fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: COLORS.secondary, fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend iconType="circle" />
                            <Line
                                type="monotone"
                                dataKey="present"
                                stroke={COLORS.success}
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Present"
                            />
                            <Line
                                type="monotone"
                                dataKey="late"
                                stroke={COLORS.accent}
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Late"
                            />
                            <Line
                                type="monotone"
                                dataKey="absent"
                                stroke={COLORS.danger}
                                strokeWidth={3}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Absent"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
