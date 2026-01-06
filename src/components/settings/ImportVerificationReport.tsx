
"use client";
import React, { useState } from 'react';
import { verifyImportHealth } from '@/lib/actions/verifyImport';
import { AlertCircle, CheckCircle2, RefreshCcw, Trash2 } from 'lucide-react';
// import { cleanupFailedImports } from '@/lib/cleanup'; // Can't import server logic directly to client
// Ideally we would wrap cleanup in a server action or API route.
// For now, I will just render the report. If user wants cleanup, they can do it via API (if I create one) or console.
// Creating a wrapper action in `verifyImport.ts` would be cleanest but I already wrote that file. 
// I will stick to Verification only as per strict instruction "Verification Dashboard UI".

export default function ImportVerificationReport() {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runCheck = async () => {
        setLoading(true);
        try {
            const data = await verifyImportHealth();
            setReport(data);
        } catch (e) {
            console.error("Verification failed", e);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm mt-8 animate-in fade-in transition-all">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Post-Import Verification</h3>
                    <p className="text-xs text-slate-500">Run a health check to detect data integrity issues.</p>
                </div>
                <button
                    onClick={runCheck}
                    disabled={loading}
                    className="flex gap-2 items-center text-sm bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                    <RefreshCcw className={`h-4 w-4 ${loading && 'animate-spin'}`} />
                    {loading ? 'Scanning Database...' : 'Run Health Check'}
                </button>
            </div>

            {report && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-semibold">Total Workforce</p>
                            <p className="text-2xl font-bold text-slate-800">{report.total}</p>
                        </div>

                        <div className={`p-4 rounded-lg border ${report.issues.salary > 0 ? 'bg-amber-50 border-amber-100 text-amber-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {report.issues.salary > 0 ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                <p className="text-xs uppercase font-semibold">Salary Profiles</p>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold">{report.total - report.issues.salary} <span className="text-sm opacity-70">/ {report.total}</span></p>
                            </div>
                            {report.issues.salary > 0 && <p className="text-xs mt-1 font-medium bg-amber-100 px-2 py-0.5 rounded inline-block text-amber-900">{report.issues.salary} Missing</p>}
                        </div>

                        <div className={`p-4 rounded-lg border ${report.issues.department > 0 ? 'bg-orange-50 border-orange-100 text-orange-800' : 'bg-green-50 border-green-100 text-green-800'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                {report.issues.department > 0 ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                <p className="text-xs uppercase font-semibold">Dept Assignments</p>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold">{report.total - report.issues.department} <span className="text-sm opacity-70">/ {report.total}</span></p>
                            </div>
                            {report.issues.department > 0 && <p className="text-xs mt-1 font-medium bg-orange-100 px-2 py-0.5 rounded inline-block text-orange-900">{report.issues.department} Missing</p>}
                        </div>
                    </div>

                    {/* Ghost Records Alert */}
                    {(report.issues.salary > 0 || report.issues.department > 0) && (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Trash2 className="w-4 h-4 text-slate-500" /> Ghost Records Detected
                                </h4>
                                <p className="text-xs text-slate-500 max-w-lg">
                                    Some employees were created without Department or Salary data, likely due to a previous crash.
                                    These "partial records" can cause payroll errors.
                                </p>
                            </div>
                            {/* Placeholder for Cleanup - ideally wired */}
                            <div className="text-xs text-slate-400 italic">
                                Contact Admin to run auto-cleanup.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
