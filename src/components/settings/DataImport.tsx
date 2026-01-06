'use client';

import React, { useState } from 'react';
import CSVImporter from '@/components/common/CSVImporter';
import {
    bulkImportEmployees,
    importLeaveBalances,
    importPayrollHistory,
    importJobRequisitions,
    importPerformanceGoals,
    importTrainingRecords
} from '@/lib/actions/import-actions';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DataImport() {
    const router = useRouter();
    const [status, setStatus] = useState<'IDLE' | 'IMPORTING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [progress, setProgress] = useState<{ current: number, total: number }>({ current: 0, total: 0 });
    const [stats, setStats] = useState({ success: 0, failed: 0 });
    const [errorLog, setErrorLog] = useState<any[]>([]);

    const processInBatches = async (data: any[], importFn: (chunk: any[]) => Promise<any>, label: string) => {
        if (!confirm(`Are you sure you want to import ${data.length} records for ${label}?`)) return;

        setStatus('IMPORTING');
        setStats({ success: 0, failed: 0 });
        setErrorLog([]);
        setProgress({ current: 0, total: data.length });

        const BATCH_SIZE = 50; // Increased to 50 as per High Integrity Plan (Client-Side Batching)

        try {
            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const chunk = data.slice(i, i + BATCH_SIZE);
                setProgress({ current: i, total: data.length });

                // Call Server Action
                const result = await importFn(chunk);

                if (result.success) {
                    // Update Stats
                    const batchSuccess = result.successCount || (chunk.length - (result.errorCount || 0));
                    const batchFailed = result.failedRows ? result.failedRows.length : (result.errorCount || 0);

                    setStats(prev => ({
                        success: prev.success + batchSuccess,
                        failed: prev.failed + batchFailed
                    }));

                    if (result.failedRows && result.failedRows.length > 0) {
                        setErrorLog(prev => [...prev, ...result.failedRows]);
                    } else if (result.errors && result.errors.length > 0) {
                        // Fallback for actions not yet refactored to failedRows
                        setErrorLog(prev => [...prev, ...result.errors.map((e: string) => ({ email: 'Unknown', reason: e }))]);
                    }

                } else {
                    // Critical Batch Failure
                    setStats(prev => ({ ...prev, failed: prev.failed + chunk.length }));
                    setErrorLog(prev => [...prev, { email: 'BATCH_FAIL', reason: result.error || 'Unknown Batch Error' }]);
                }

                // Small breath for UI
                await new Promise(r => setTimeout(r, 20));
            }

            setProgress({ current: data.length, total: data.length });
            setStatus('SUCCESS');
            router.refresh();

        } catch (error: any) {
            setStatus('ERROR');
            setErrorLog(prev => [...prev, { email: 'CRITICAL', reason: error.message }]);
        }
    };

    const handleEmployeeImport = async (data: any[]) => { await processInBatches(data, bulkImportEmployees, "Employees"); };
    const handleLeaveImport = async (data: any[]) => { await processInBatches(data, importLeaveBalances, "Leave Balances"); };
    const handlePayrollImport = async (data: any[]) => { await processInBatches(data, importPayrollHistory, "Payroll History"); };
    const handleATSImport = async (data: any[]) => { await processInBatches(data, importJobRequisitions, "Job Requisitions"); };
    const handlePerformanceImport = async (data: any[]) => { await processInBatches(data, importPerformanceGoals, "Performance Goals"); };
    const handleTrainingImport = async (data: any[]) => { await processInBatches(data, importTrainingRecords, "Training Records"); };

    return (
        <div className="space-y-8 animate-in fade-in pb-12">
            <div>
                <h3 className="text-lg font-bold text-slate-800">High Integrity Data Import</h3>
                <p className="text-sm text-slate-500">Bulk upload data with real-time feedback and fault tolerance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Import Card */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">1. Bulk Employee Import</h4>
                        <p className="text-xs text-slate-500">Creates Employee profiles + User accounts.</p>
                    </div>
                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> firstName, lastName, email
                    </div>
                    <CSVImporter onImport={handleEmployeeImport} label="Upload Employees" />
                </div>

                {/* Other Importers (Collapsed for brevity visually, but fully functional) */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4"><h4 className="font-semibold text-slate-800">2. Leave Balances</h4></div>
                    <CSVImporter onImport={handleLeaveImport} label="Upload Balances" />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4"><h4 className="font-semibold text-slate-800">3. Payroll (YTD)</h4></div>
                    <CSVImporter onImport={handlePayrollImport} label="Upload Payroll" />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4"><h4 className="font-semibold text-slate-800">4. Requisitions (ATS)</h4></div>
                    <CSVImporter onImport={handleATSImport} label="Upload Requisitions" />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4"><h4 className="font-semibold text-slate-800">5. Goals</h4></div>
                    <CSVImporter onImport={handlePerformanceImport} label="Upload Goals" />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4"><h4 className="font-semibold text-slate-800">6. Training</h4></div>
                    <CSVImporter onImport={handleTrainingImport} label="Upload Training" />
                </div>
            </div>

            {/* High Integrity Feedback Panel */}
            {(status === 'IMPORTING' || status === 'SUCCESS' || status === 'ERROR') && (
                <div className="fixed inset-x-0 bottom-0 p-6 bg-white border-t border-slate-200 shadow-2xl z-50 transition-transform duration-300">
                    <div className="max-w-6xl mx-auto flex gap-8">
                        {/* Progress Section */}
                        <div className="w-1/3 space-y-4">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                {status === 'IMPORTING' && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
                                {status === 'SUCCESS' && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {status === 'ERROR' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                                {status === 'IMPORTING' ? 'Importing Data...' : 'Import Report'}
                            </h4>
                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${status === 'ERROR' ? 'bg-rose-500' : 'bg-blue-600'}`}
                                    style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-semibold text-slate-600">
                                <span>{Math.round((progress.current / progress.total) * 100)}% Complete</span>
                                <span>{progress.current} / {progress.total}</span>
                            </div>
                            {status === 'SUCCESS' && (
                                <button onClick={() => setStatus('IDLE')} className="text-xs text-blue-600 underline hover:text-blue-800">
                                    Close Panel
                                </button>
                            )}
                        </div>

                        {/* Stats & Logs */}
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="bg-green-50 border border-green-100 p-4 rounded-lg text-center">
                                <span className="block text-2xl font-bold text-green-700">{stats.success}</span>
                                <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Successful</span>
                            </div>
                            <div className="bg-rose-50 border border-rose-100 p-4 rounded-lg text-center">
                                <span className="block text-2xl font-bold text-rose-700">{stats.failed}</span>
                                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Failed / Skipped</span>
                            </div>
                        </div>

                        {/* Error Viewer */}
                        <div className="w-1/3 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col h-32">
                            <h5 className="text-xs font-bold text-slate-700 mb-2 uppercase flex justify-between">
                                Error Log
                                <span className="bg-slate-200 text-slate-600 px-2 rounded-full text-[10px]">{errorLog.length}</span>
                            </h5>
                            <div className="flex-1 overflow-y-auto space-y-1 text-xs">
                                {errorLog.length === 0 ? (
                                    <p className="text-slate-400 italic text-center mt-8">No errors recorded.</p>
                                ) : (
                                    errorLog.map((log, i) => (
                                        <div key={i} className="flex gap-2 p-1 hover:bg-white rounded">
                                            <span className="font-mono text-rose-600 font-bold shrink-0">{log.email?.substring(0, 12)}...</span>
                                            <span className="text-slate-600 truncate">{log.reason}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
