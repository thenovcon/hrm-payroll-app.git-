'use client';

import React from 'react';
import { X, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface DrillDownProps {
    isOpen: boolean;
    onClose: () => void;
    data: any | null; // The metric payload clicked
}

export default function DrillDownPanel({ isOpen, onClose, data }: DrillDownProps) {
    if (!isOpen || !data) return null;

    // Mock "AI" Analysis based on data type
    const analyzeData = (payload: any) => {
        // Mock logic to simulate "Deep Dive"
        if (payload.type === 'payroll') {
            const isHigh = payload.value > 440000;
            return {
                title: `Payroll Analysis: ${payload.label}`,
                mean: 435000, // Mock 6-month avg
                deviation: isHigh ? '+12%' : '-2%',
                insight: isHigh
                    ? "Payroll is 12% above the 6-month average. This is an outlier."
                    : "Payroll is consistent with the 6-month trend.",
                rootCause: isHigh
                    ? "High volume of overtime claims in Operations department (200 hrs)."
                    : "Standard salary disbursement with no significant variables.",
                action: isHigh
                    ? "Review overtime approval workflows for Operations Dept Head."
                    : "No action required. Monitor next month."
            };
        } else if (payload.type === 'headcount') {
            return {
                title: `Headcount Logic: ${payload.label}`,
                mean: 140,
                deviation: '+2',
                insight: "Headcount is steadily increasing.",
                rootCause: "New hires in Engineering and Sales.",
                action: "Ensure onboarding sessions are scheduled."
            };
        }
        return {
            title: "Metric Analysis",
            mean: 0, deviation: "0%",
            insight: "Data point selected.",
            rootCause: "N/A",
            action: "N/A"
        };
    };

    const analysis = analyzeData(data);

    // Mock Chart Data for the Panel (6-month context)
    const contextChartData = [
        { month: 'Jun', value: 410000 },
        { month: 'Jul', value: 415000 },
        { month: 'Aug', value: 422000 },
        { month: 'Sep', value: 430000 },
        { month: 'Oct', value: 445000 },
        { month: 'Nov', value: 452000 },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full">
                    <X className="w-5 h-5 text-slate-500" />
                </button>

                <div className="mt-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 mb-4">
                        <Lightbulb className="w-3 h-3" />
                        AI Diagnostic Insight
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900">{analysis.title}</h2>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold text-slate-800">GH₵{data.value?.toLocaleString()}</span>
                        <span className={`text-sm font-semibold ${analysis.deviation.includes('+') ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {analysis.deviation} vs mean
                        </span>
                    </div>
                </div>

                {/* Mini Context Chart */}
                <div className="h-48 mt-8 mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contextChartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis hide />
                            <Tooltip />
                            <ReferenceLine y={analysis.mean} stroke="orange" strokeDasharray="3 3" label="Mean" />
                            <Bar dataKey="value" fill="#94a3b8" radius={[4, 4, 4, 4]} />
                            {/* Highlight the selected bar if possible, or just show context */}
                        </BarChart>
                    </ResponsiveContainer>
                    <p className="text-xs text-center text-slate-400 mt-2">6-Month Trend Context</p>
                </div>

                {/* The "Three Questions" */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                            What happened?
                        </h4>
                        <p className="text-sm text-slate-600">{analysis.insight}</p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            Why did it happen?
                        </h4>
                        <p className="text-sm text-slate-600">{analysis.rootCause}</p>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-800 mb-2">
                            <CheckCircleIcon className="w-4 h-4" />
                            What should I do?
                        </h4>
                        <p className="text-sm text-emerald-700 font-medium">{analysis.action}</p>
                        <button className="mt-3 text-xs bg-white border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-50 transition-colors">
                            Take Action
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CheckCircleIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
    )
}
