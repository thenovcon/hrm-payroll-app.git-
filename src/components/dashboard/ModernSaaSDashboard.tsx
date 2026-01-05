'use client';

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import {
    DollarSign, Users, CheckCircle, Briefcase,
    ArrowUpRight, ArrowDownRight, MoreHorizontal,
    Bell, Search, Settings
} from 'lucide-react';

const COLORS = {
    primary: '#3b82f6',   // Blue
    success: '#10b981',   // Emerald
    warning: '#f59e0b',   // Amber
    purple: '#8b5cf6',    // Violet
    text: '#1e293b',
    subtext: '#64748b',
    grid: '#f1f5f9'
};

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

interface DashboardProps {
    metrics: {
        headcount: number;
        payrollCost: number;
        attendanceRate: number;
        openJobs: number;
    };
    trends: {
        payroll: any[]; // { month, cost }
        headcountByDept: any[]; // { name, value }
        attendance: any[]; // { date, present }
        applications: number[]; // 12 months array
    };
    extraCharts?: {
        recruitmentVelocity: any[];
        budgetVsActual: any[];
        goalCompletion: any[];
    };
    recentActivity: any[]; // Mocked for now?
    userRole?: string;
}

export default function ModernSaaSDashboard({ metrics, trends, extraCharts, recentActivity = [], userRole = 'EMPLOYEE' }: DashboardProps) {
    const canViewFinancials = ['ADMIN', 'HR_MANAGER', 'ACCOUNTANT', 'PAYROLL_OFFICER'].includes(userRole);

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 space-y-8 font-sans text-slate-900">

            {/* Top Stats Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${canViewFinancials ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}>
                {canViewFinancials && (
                    <MetricCard
                        title="Total Payroll"
                        value={`GH₵${(metrics.payrollCost / 1000).toFixed(1)}k`}
                        change="+2.5%"
                        trend="up"
                        color="blue"
                        icon={<DollarSign className="w-5 h-5 text-white" />}
                        percent={78}
                    />
                )}
                <MetricCard
                    title="Total Headcount"
                    value={metrics.headcount.toString()}
                    change="+12"
                    trend="up"
                    color="emerald"
                    icon={<Users className="w-5 h-5 text-white" />}
                    percent={92}
                />
                <MetricCard
                    title="Attendance Rate"
                    value={`${metrics.attendanceRate}%`}
                    change="-2%"
                    trend="down"
                    color="purple"
                    icon={<CheckCircle className="w-5 h-5 text-white" />}
                    percent={85}
                />
                <MetricCard
                    title="Open Positions"
                    value={metrics.openJobs.toString()}
                    change="+4 New"
                    trend="up"
                    color="amber"
                    icon={<Briefcase className="w-5 h-5 text-white" />}
                    percent={40}
                />
            </div>

            {/* Middle Section: Main Chart + Side Donut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Bar Chart (Revenue/Payroll) - HIDE if no financial access */}
                {canViewFinancials ? (
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Payroll Cost Trend</h3>
                                <p className="text-sm text-slate-500">Monthly gross salary distribution</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Actual</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-200"></span> Projected</span>
                            </div>
                        </div>
                        <div className="h-[320px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trends.payroll} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: COLORS.subtext, fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: COLORS.subtext, fontSize: 12 }}
                                        tickFormatter={(val) => `${val / 1000}k`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="cost"
                                        fill={COLORS.primary}
                                        radius={[6, 6, 6, 6]}
                                        barSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    // Replacement widget for Line Managers (Recruitment/Team focus)
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-800">Team Performance & Activity</h3>
                            <p className="text-sm text-slate-500">Overview of your department's key metrics.</p>
                            {/* Can add Team-specific chart here later */}
                        </div>
                    </div>
                )}

                {/* Donut Chart (Headcount) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Headcount</h3>
                        <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                    <div className="h-[200px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={trends.headcountByDept}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={6}
                                >
                                    {trends.headcountByDept.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-slate-400 text-xs font-medium">Total</span>
                            <span className="text-2xl font-bold text-slate-800">{metrics.headcount}</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-3">
                        {trends.headcountByDept.slice(0, 3).map((dept, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }}></div>
                                    <span className="text-slate-600">{dept.name}</span>
                                </div>
                                <span className="font-semibold text-slate-800">{dept.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Extra Row: Recruitment & Goals (Requested Mock Data) */}
            {extraCharts && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Time to Hire (Bar) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Time to Hire (Days)</h3>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={extraCharts.recruitmentVelocity} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="role" type="category" width={80} tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Bar dataKey="days" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Budget vs Actual (Line) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Budget vs Actual (6 Mo)</h3>
                        <div className="h-[180px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={extraCharts.budgetVsActual}>
                                    <defs>
                                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="actual" stroke="#ef4444" fillOpacity={1} fill="url(#colorActual)" />
                                    <Area type="monotone" dataKey="budget" stroke="#cbd5e1" fill="transparent" strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Goal Completion (Radial/Pie substitute) */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Goal Completion</h3>
                        <div className="space-y-4">
                            {extraCharts.goalCompletion.map((dept: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-700">{dept.dept}</span>
                                        <span className="text-slate-500">{dept.completed}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2">
                                        <div
                                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${dept.completed}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Row: Detailed Trends & Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Attendance Trend (Area Chart) - "Total Income" slot */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Attendance Trend</h3>
                        {/* ... (rest of existing components) ... */}

                        <select className="text-xs border-none bg-slate-50 rounded-md py-1 px-2 text-slate-600 outline-none">
                            <option>Weekly</option>
                        </select>
                    </div>
                    <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends.attendance}>
                                <defs>
                                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.2} />
                                        <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
                                <XAxis dataKey="date" hide />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Area
                                    type="monotone"
                                    dataKey="present"
                                    stroke={COLORS.success}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPresent)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <div>
                            <span className="text-2xl font-bold text-slate-800">{metrics.attendanceRate}%</span>
                            <p className="text-xs text-slate-500 mt-1">Avg. Attendance</p>
                        </div>
                        <div className="flex gap-1">
                            {/* Mini heatmap or dots */}
                            {[1, 1, 1, 1, 0, 1, 1].map((p, i) => (
                                <div key={i} className={`w-2 h-8 rounded-sm ${p ? 'bg-emerald-200' : 'bg-rose-200'}`}></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Application/Recruitment Grid - "Total Payment" slot */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Recruitment Activity</h3>
                        <select className="text-xs border-none bg-slate-50 rounded-md py-1 px-2 text-slate-600 outline-none">
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div className="h-[180px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends.applications.map((v, i) => ({ param: i, val: v }))}>
                                <Bar dataKey="val" fill={COLORS.warning} radius={[2, 2, 2, 2]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-center">
                        <span className="text-2xl font-bold text-slate-800">{trends.applications.reduce((a, b) => a + b, 0)}</span>
                        <p className="text-xs text-slate-500">Total Applications YTD</p>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Recent Activity</h3>
                        <a href="#" className="text-xs text-blue-600 font-medium hover:underline">View All</a>
                    </div>
                    <div className="space-y-4">
                        {/* Mock Items matching aesthetics */}
                        {[
                            { title: 'Payload Run', time: '10 min ago', icon: DollarSign, bg: 'bg-green-100', text: 'text-green-600', val: 'Success' },
                            { title: 'New Hire Added', time: '30 min ago', icon: Users, bg: 'bg-blue-100', text: 'text-blue-600', val: '+1' },
                            { title: 'Leave Request', time: '2 hrs ago', icon: Briefcase, bg: 'bg-orange-100', text: 'text-orange-600', val: 'Pending' },
                            { title: 'Policy Update', time: '5 hrs ago', icon: Bell, bg: 'bg-purple-100', text: 'text-purple-600', val: 'v1.2' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                                    <item.icon className={`w-5 h-5 ${item.text}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-slate-800 truncate">{item.title}</h4>
                                    <p className="text-xs text-slate-500">{item.time}</p>
                                </div>
                                <span className="text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Sub-Component for Metric Cards
function MetricCard({ title, value, change, trend, color, icon, percent }: any) {
    const colorStyles: any = {
        blue: { bg: 'bg-blue-600', progress: 'bg-blue-600' },
        emerald: { bg: 'bg-emerald-500', progress: 'bg-emerald-500' },
        purple: { bg: 'bg-violet-600', progress: 'bg-violet-600' },
        amber: { bg: 'bg-amber-500', progress: 'bg-amber-500' }
    };

    const style = colorStyles[color] || colorStyles.blue;

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-${color}-500/20 ${style.bg}`}>
                    {icon}
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'} flex items-center`}>
                    {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {change}
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
            </div>

            {/* Progress Bar (Vertical in Desgin, Horizontal more standard, let's do Vertical on right side?) 
                Actually the Finova design has a vertical bar on the right. 
                Startimple: Horizontal Bar at bottom. 
            */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${style.progress}`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
}
