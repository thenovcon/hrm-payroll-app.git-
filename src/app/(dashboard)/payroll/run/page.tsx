'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPayrollRun } from '@/lib/actions/payroll-actions';

export default function RunPayrollPage() {
    const router = useRouter();
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRunPayroll = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await createPayrollRun(month, year);
            if (result.success) {
                router.push(`/payroll`); // Redirect to Payroll List
                router.refresh();
            } else {
                setError(result.error || 'Failed to generate payroll.');
            }
        } catch (e) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Run Global Payroll</h1>
                <p className="text-slate-500 mb-8">
                    Generate payroll for all active employees for a specific period. This will create a DRAFT run that you can review before approving.
                </p>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                <option key={m} value={m}>
                                    {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRunPayroll}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin text-xl">◌</span> Processing...
                            </>
                        ) : (
                            'Generate Payroll'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
