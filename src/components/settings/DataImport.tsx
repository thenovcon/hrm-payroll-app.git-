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

export default function DataImport() {
    const [status, setStatus] = useState<'IDLE' | 'IMPORTING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [report, setReport] = useState<any>(null);

    const handleResult = (result: any) => {
        if (result.success) {
            setStatus('SUCCESS');
            setReport(result);
        } else {
            setStatus('ERROR');
            setReport({ message: result.error });
        }
    };

    const handleEmployeeImport = async (data: any[]) => {
        if (!confirm(`Are you sure you want to import ${data.length} employees? This will create user accounts for each.`)) return;

        setStatus('IMPORTING');
        const result = await bulkImportEmployees(data);
        handleResult(result);
    };

    const handleLeaveImport = async (data: any[]) => {
        if (!confirm(`Import ${data.length} leave balance records? Existing balances for the same year will be updated.`)) return;
        setStatus('IMPORTING');
        const result = await importLeaveBalances(data);
        handleResult(result);
    };

    const handlePayrollImport = async (data: any[]) => {
        if (!confirm(`Import ${data.length} historical payslips? This will create "PAID" payroll runs for past months.`)) return;
        setStatus('IMPORTING');
        const result = await importPayrollHistory(data);
        handleResult(result);
    };

    const handleATSImport = async (data: any[]) => {
        if (!confirm(`Import ${data.length} job requisitions?`)) return;
        setStatus('IMPORTING');
        const result = await importJobRequisitions(data);
        handleResult(result);
    };

    const handlePerformanceImport = async (data: any[]) => {
        if (!confirm(`Import ${data.length} goals?`)) return;
        setStatus('IMPORTING');
        const result = await importPerformanceGoals(data);
        handleResult(result);
    };

    const handleTrainingImport = async (data: any[]) => {
        if (!confirm(`Import ${data.length} certifications?`)) return;
        setStatus('IMPORTING');
        const result = await importTrainingRecords(data);
        handleResult(result);
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
                        <p className="text-xs text-slate-500">Import past payslips for tax calculations.</p>
                    </div>
                    <div className="bg-purple-50 text-purple-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> email, grossSalary, netPay, month, year
                    </div>
                    <CSVImporter onImport={handlePayrollImport} label="Upload Payroll History" />
                </div>

                {/* ATS Requisitions */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="mb-4">
                        <h4 className="font-semibold text-slate-800">4. Job Requisitions</h4>
                        <p className="text-xs text-slate-500">Migrate open roles and vacancies.</p>
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
                        <p className="text-xs text-slate-500">Historical training records.</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-800 text-xs p-3 rounded-lg mb-4">
                        <strong>Required:</strong> email, name, issuer, issueDate
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
                    {report.errorCount > 0 && (
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
                <div className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing Import...
                </div>
            )}
        </div>
    );
}
