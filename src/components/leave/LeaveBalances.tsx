'use client';

import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LeaveBalances({ balances }: { balances: any[] }) {
    const currentYear = new Date().getFullYear();
    const currentBalances = balances.filter(b => b.year === currentYear);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Summary Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">My Time Off</h2>
                        <p className="text-blue-100 max-w-xl">
                            Plan your rest and recharge. You have <span className="font-bold text-white">{currentBalances.reduce((acc, b) => acc + (b.daysAllocated - b.daysUsed), 0)} days</span> remaining this year.
                        </p>
                    </div>
                    <button className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/5">
                        + Request Leave
                    </button>
                </div>
            </div>

            {/* Balances Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentBalances.map((bal) => {
                    const remaining = bal.daysAllocated - bal.daysUsed;
                    const percentage = Math.round((bal.daysUsed / bal.daysAllocated) * 100);
                    const isLow = remaining < 5;

                    return (
                        <div key={bal.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>

                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${isLow ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold text-slate-800">{remaining}</span>
                            </div>

                            <h3 className="font-bold text-slate-700 mb-1">{bal.leaveType.name}</h3>
                            <p className="text-xs text-slate-400 mb-4">Days Remaining</p>

                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.min(100, (remaining / bal.daysAllocated) * 100)}%` }} // Visualizing Remaining %
                                ></div>
                            </div>

                            <div className="flex justify-between text-xs text-slate-500 font-medium">
                                <span>Used: {bal.daysUsed}</span>
                                <span>Total: {bal.daysAllocated}</span>
                            </div>
                        </div>
                    );
                })}

                {/* Legend / Info Card */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200 flex flex-col justify-center items-center text-center">
                    <Clock className="w-8 h-8 text-slate-400 mb-3" />
                    <h4 className="font-bold text-slate-600">Carry Over Policy</h4>
                    <p className="text-xs text-slate-400 mt-2">
                        Up to 5 days can be carried over to Q1 {currentYear + 1}. <br />
                        <span className="underline cursor-pointer hover:text-blue-500">Read full policy</span>
                    </p>
                </div>
            </div>

            {/* History Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Leave Balance History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-semibold">Year</th>
                                <th className="p-4 font-semibold">Leave Type</th>
                                <th className="p-4 font-semibold text-center">Allocated</th>
                                <th className="p-4 font-semibold text-center">Used</th>
                                <th className="p-4 font-semibold text-center">Remaining</th>
                                <th className="p-4 font-semibold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {balances.map(b => (
                                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 font-medium text-slate-700">{b.year}</td>
                                    <td className="p-4 text-slate-600">{b.leaveType.name}</td>
                                    <td className="p-4 text-center text-slate-600">{b.daysAllocated}</td>
                                    <td className="p-4 text-center text-slate-600">{b.daysUsed}</td>
                                    <td className="p-4 text-center font-bold text-slate-800">{b.daysAllocated - b.daysUsed}</td>
                                    <td className="p-4 text-right">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                            <CheckCircle2 className="w-3 h-3" /> Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
