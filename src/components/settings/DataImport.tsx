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
    const [report, setReport] = useState<any>(null);
    const [progress, setProgress] = useState<{ current: number, total: number }>({ current: 0, total: 0 });

    const processInBatches = async (data: any[], importFn: (chunk: any[]) => Promise<any>, label: string) => {
        if (!confirm(`Are you sure you want to import ${data.length} records for ${label}?`)) return;

        setStatus('IMPORTING');
        setReport(null);
        setProgress({ current: 0, total: data.length });

        const BATCH_SIZE = 20; // Reduced to prevent Server Component render timeouts
        let successTotal = 0;
        let errorsTotal: string[] = [];

        try {
            for (let i = 0; i < data.length; i += BATCH_SIZE) {
                const chunk = data.slice(i, i + BATCH_SIZE);
                setProgress({ current: i, total: data.length }); // Update progress start of batch

                const result = await importFn(chunk);

                if (result.success) {
                    // Extract number from "Successfully imported X employees" -- simplified logic
                    // The server returns a message, but we can assume success for the chunk minus specific errors
                    // But the server action returns `errorCount`. 
                    // Let's rely on the server returning explicit counts if possible, 
                    // or just assume chunk size - errorCount.
                    const chunkErrors = result.errorCount || 0;
                    successTotal += (chunk.length - chunkErrors);
                    if (result.errors) errorsTotal = [...errorsTotal, ...result.errors];
                } else {
                    errorsTotal.push(`Batch ${i / BATCH_SIZE + 1} Failed: ${result.error}`);
                }

                // Small delay to allow UI update and prevent UI freeze
                await new Promise(r => setTimeout(r, 50));
            }

            // Client-side refresh only - avoids server component render crashes during action response
            router.refresh();

            setProgress({ current: data.length, total: data.length }); // Done

            if (errorsTotal.length > 0) {
                setStatus('SUCCESS'); // Still partial success
                setReport({
                    message: `Completed with some issues. Imported ${successTotal}/${data.length}.`,
                    errorCount: errorsTotal.length,
                    errors: errorsTotal
                });
            } else {
                setStatus('SUCCESS');
                setReport({
                    message: `Successfully imported all ${successTotal} records.`,
                    errorCount: 0,
                    errors: []
                });
            }

        } catch (error: any) {
            setStatus('ERROR');
            setReport({ message: `Critical Batch Error: ${error.message}`, errorCount: 1, errors: [error.message] });
        }
    };

    const handleEmployeeImport = async (data: any[]) => {
        await processInBatches(data, bulkImportEmployees, "Employees");
    };

    const handleLeaveImport = async (data: any[]) => {
        await processInBatches(data, importLeaveBalances, "Leave Balances");
    };

    const handlePayrollImport = async (data: any[]) => {
        await processInBatches(data, importPayrollHistory, "Payroll History");
    };

    const handleATSImport = async (data: any[]) => {
        await processInBatches(data, importJobRequisitions, "Job Requisitions");
    };

    const handlePerformanceImport = async (data: any[]) => {
        await processInBatches(data, importPerformanceGoals, "Performance Goals");
    };

    const handleTrainingImport = async (data: any[]) => {
        await processInBatches(data, importTrainingRecords, "Training Records");
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-12">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Data Import "Pipes"</h3>
                <p className="text-sm text-slate-500">Bulk upload data to initialize your production environment.</p>
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

                {/* Leave Balances */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">2. Leave Balances</h4>
                        <p className="text-xs text-slate-500">Import carry-over days or initial quotas.</p>
                    </div>
                    <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> email, leaveType, daysAllocated
                    </div>
                    <CSVImporter onImport={handleLeaveImport} label="Upload Balances" />
                </div>

                {/* Payroll History */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">3. Payroll History (YTD)</h4>
                        <p className="text-xs text-slate-500">Import past payslips.</p>
                    </div>
                    <div className="bg-purple-50 text-purple-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> email, grossSalary, netPay, month
                    </div>
                    <CSVImporter onImport={handlePayrollImport} label="Upload Payroll History" />
                </div>

                {/* ATS Requisitions */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">4. Job Requisitions</h4>
                        <p className="text-xs text-slate-500">Migrate open roles.</p>
                    </div>
                    <div className="bg-orange-50 text-orange-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> title, department
                    </div>
                    <CSVImporter onImport={handleATSImport} label="Upload Requisitions" />
                </div>

                {/* Performance Goals */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">5. Performance Goals</h4>
                        <p className="text-xs text-slate-500">Migrate active objectives.</p>
                    </div>
                    <div className="bg-teal-50 text-teal-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> email, title, status
                    </div>
                    <CSVImporter onImport={handlePerformanceImport} label="Upload Goals" />
                </div>

                {/* Training Records */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">6. Training/Certifications</h4>
                        <p className="text-xs text-slate-500">Historical records.</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> email, name, issuer
                    </div>
                    <CSVImporter onImport={handleTrainingImport} label="Upload Certifications" />
                </div>

            </div>

            {/* Status Feedback Section - Global for this page */}
            {(status === 'SUCCESS' || status === 'ERROR') && report && (
                <div className={`mt-6 p-4 rounded-xl border ${status === 'SUCCESS' ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'}`}>
                    <h5 className={`flex items-center gap-2 font-bold text-sm mb-2 ${status === 'SUCCESS' ? 'text-green-700' : 'text-rose-700'}`}>
                        {status === 'SUCCESS' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                        {status === 'SUCCESS' ? 'Import Complete' : 'Import Failed'}
                    </h5>
                    <p className="text-xs text-slate-700">{report.message}</p>
                    {report.errorCount > 0 && report.errors && (
                        <div className="mt-2 text-xs text-rose-600 bg-white p-2 rounded border border-rose-100">
                            <p className="font-semibold">{report.errorCount} errors occurred:</p>
                            <ul className="list-disc list-inside mt-1 max-h-32 overflow-y-auto">
                                {report.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            {status === 'IMPORTING' && (
                <div className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-4 rounded-xl shadow-lg flex flex-col gap-2 min-w-[300px]">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="font-semibold">Processing Batch Import...</span>
                    </div>
                    <div className="w-full bg-blue-800/50 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-blue-100 flex justify-between">
                        <span>Processed {progress.current} of {progress.total}</span>
                        <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                    </div>
                </div>
            )}
        </div>
    );
}
