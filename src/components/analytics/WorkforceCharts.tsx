'use client';

import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ChartProps {
    genderData: { name: string; value: number }[];
    deptData: { name: string; value: number }[];
    tenureData: { name: string; value: number }[];
}

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

export default function WorkforceCharts({ genderData, deptData, tenureData }: ChartProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Gender Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Gender Distribution</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-2">
                    {genderData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span>{entry.name}: {entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tenure Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Tenure Breakdown</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={tenureData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Department Headcount (Full Width) */}
            <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Headcount by Department</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deptData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-15} textAnchor="end" height={60} />
                            <YAxis />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}
