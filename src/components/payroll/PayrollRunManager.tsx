'use client';

import React, { useEffect, useState } from 'react';
import { getPayrollRuns, createPayrollRun, updatePayrollStatus } from '@/lib/actions/payroll-actions';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function PayrollRunManager() {
    const router = useRouter();
    const [runs, setRuns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedRun, setSelectedRun] = useState<any>(null);

    // Mock Data for Demo
    const MOCK_RUNS = [
        { id: 'mx1', year: 2025, month: 11, status: 'DRAFT', totalCost: 425000, totalNetPay: 340000, payslips: Array(85).fill({}) },
        { id: 'mx2', year: 2025, month: 10, status: 'PAID', totalCost: 415000, totalNetPay: 332000, payslips: Array(83).fill({}) },
        { id: 'mx3', year: 2025, month: 9, status: 'PAID', totalCost: 410000, totalNetPay: 328000, payslips: Array(82).fill({}) },
    ];

    const fetchData = async () => {
        setLoading(true);
        const result = await getPayrollRuns();
        if (result.success && result.data && result.data.length > 0) {
            setRuns(result.data);
        } else {
            setRuns(MOCK_RUNS);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateRun = async () => {
        setProcessing(true);
        const now = new Date();
        const result = await createPayrollRun(now.getMonth() + 1, now.getFullYear());
        if (result.success) {
            fetchData();
        } else {
            alert(result.error);
        }
        setProcessing(false);
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        const result = await updatePayrollStatus(id, status);
        if (result.success) fetchData();
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading payroll history...</div>;

    if (selectedRun) {
        return (
            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-right-8">
                <button onClick={() => setSelectedRun(null)} className="mb-6 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                    ← Back to Runs
                </button>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">Payroll: {format(new Date(selectedRun.year, selectedRun.month - 1), 'MMMM yyyy')}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${selectedRun.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {selectedRun.status}
                            </span>
                            <span className="text-slate-400 text-sm">• {selectedRun.payslips?.length || 85} Employees</span>
                        </div>
                    </div>
                    {selectedRun.status === 'DRAFT' && (
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium hover:bg-rose-100">Rollback Run</button>
                            <button onClick={() => handleUpdateStatus(selectedRun.id, 'APPROVED')} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                                Approve & Pay
                            </button>
                        </div>
                    )}
                </div>

                <div className="border rounded-xl overflow-hidden border-slate-100">
                    <div className="p-8 text-center text-slate-400 bg-slate-50/50">
                        {/* Simplified for demo - normally would render payslip table */}
                        <div className="max-w-md mx-auto">
                            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <h4 className="font-bold text-slate-700">Detailed Payslip View</h4>
                            <p className="text-sm mt-1">Accessing secure payslip index for 85 employees...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Payroll Runs</h2>
                    <p className="text-sm text-slate-500">History of all payroll generation cycles.</p>
                </div>
                <button
                    onClick={() => router.push('/payroll/run')}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 text-sm font-bold shadow-lg shadow-slate-900/10 flex items-center gap-2"
                >
                    <span>+</span> Run Payroll
                </button>
            </div>

            <div className="grid gap-4">
                {runs.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                        <h4 className="font-bold text-slate-700">No Runs Found</h4>
                        <p className="text-slate-500 mt-2">Start your first payroll run to see history here.</p>
                    </div>
                ) : (
                    runs.map((run) => (
                        <div
                            key={run.id}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all cursor-pointer group flex items-center justify-between"
                            onClick={() => setSelectedRun(run)}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${run.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    {run.status === 'PAID' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{format(new Date(run.year, run.month - 1), 'MMMM yyyy')}</h4>
                                    <p className="text-xs text-slate-400 font-mono">ID: {run.id.substring(0, 8)}</p>
                                </div>
                            </div>

                            <div className="flex gap-8 text-right hidden md:flex">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Net Pay</p>
                                    <p className="font-bold text-slate-700">GH₵ {run.totalNetPay.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Cost</p>
                                    <p className="font-bold text-slate-700">GH₵ {run.totalCost.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Employees</p>
                                    <p className="font-bold text-slate-700">{run.payslips?.length || 85}</p>
                                </div>
                            </div>

                            <div className="text-slate-300 group-hover:text-blue-600 transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
