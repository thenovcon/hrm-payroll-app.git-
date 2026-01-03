'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';
import { DollarSign, UserCheck, Building2, AlertTriangle, TrendingUp, Download, ArrowUpRight } from 'lucide-react';

export default function PayrollDashboard() {
    const stats = [
        { label: 'Current Payroll', value: 'GH₵ 425,000', sub: 'Nov 2025', change: '+2.4%', icon: DollarSign, color: 'blue' },
        { label: 'Net Pay Avg', value: 'GH₵ 4,250', sub: 'Per Employee', change: '+0.5%', icon: UserCheck, color: 'emerald' },
        { label: 'Statutory Taxes', value: 'GH₵ 85,400', sub: 'GRA + SSNIT', change: '+1.8%', icon: Building2, color: 'purple' },
        { label: 'Variance Alerts', value: '3 High', sub: 'Requires Review', change: '-1', icon: AlertTriangle, color: 'amber' },
    ];

    const data = [
        { month: 'Jun', net: 380, tax: 60 },
        { month: 'Jul', net: 385, tax: 62 },
        { month: 'Aug', net: 390, tax: 65 },
        { month: 'Sep', net: 410, tax: 70 },
        { month: 'Oct', net: 415, tax: 72 },
        { month: 'Nov', net: 425, tax: 75 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group overflow-hidden">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity bg-${stat.color}-500 rounded-bl-3xl`}>
                            <stat.icon className={`w-8 h-8 text-${stat.color}-600`} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-extrabold text-slate-800">{stat.value}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                    {stat.change}
                                </span>
                                <p className="text-xs text-slate-400">{stat.sub}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-slate-800">Payroll Cost Trend (6 Months)</h3>
                            <p className="text-sm text-slate-400">Net Pay vs Statutory Deductions</p>
                        </div>
                        <button className="text-blue-600 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1">
                            <Download className="w-4 h-4" /> Download Report
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="net" stackId="1" stroke="#3b82f6" fill="url(#colorNet)" strokeWidth={3} name="Net Pay (k)" />
                                <Area type="monotone" dataKey="tax" stackId="1" stroke="#a855f7" fill="#a855f7" strokeWidth={3} name="Taxes (k)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
                    <h3 className="font-bold text-slate-800 mb-6">Variance Analysis</h3>
                    <div className="flex-1 space-y-4">
                        {[
                            { item: 'Basic Salary', prev: '210k', curr: '215k', diff: '+5k', reason: '2 New hires' },
                            { item: 'Overtime', prev: '15k', curr: '22k', diff: '+7k', reason: 'Seasonal surge' },
                            { item: 'Deductions', prev: '12k', curr: '18k', diff: '+6k', reason: 'Staff loans' },
                        ].map((v) => (
                            <div key={v.item} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-slate-700 text-sm">{v.item}</span>
                                    <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">{v.diff}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>{v.prev} → {v.curr}</span>
                                    <span>{v.reason}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-4 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                        View Full Variance Report
                    </button>
                </div>
            </div>

            {/* Compliance Widget */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-bold text-xl mb-1">Compliance & Statutory Status</h3>
                    <p className="text-emerald-100 text-sm">All systems nominally compliant for November run. SSNIT Tier 1 & 2 ready for extraction.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <span className="block text-2xl font-bold">100%</span>
                        <span className="text-xs text-emerald-100">GRA PAYE</span>
                    </div>
                    <div className="text-center bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <span className="block text-2xl font-bold">100%</span>
                        <span className="text-xs text-emerald-100">SSNIT</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
