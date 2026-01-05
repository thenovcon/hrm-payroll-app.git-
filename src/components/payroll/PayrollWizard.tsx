'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { validatePayrollBatch } from '@/lib/payroll/payroll-logic';
import { analyzeVariance } from '@/lib/actions/payroll-ai';
import { createPayrollRun } from '@/lib/actions/payroll-actions';
import { Loader2, AlertTriangle, CheckCircle, BrainCircuit, Download } from 'lucide-react';

export default function PayrollWizard() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [validation, setValidation] = useState<any>(null);
    const [variance, setVariance] = useState<string>('');
    const [runId, setRunId] = useState<string | null>(null);

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    // Step 1: Validation
    const runValidation = async () => {
        setLoading(true);
        try {
            const res = await validatePayrollBatch();
            setValidation(res);
            if (res.valid) {
                // Auto-advance logic could go here, but let's let user click "Next"
            }
        } finally {
            setLoading(false);
        }
    };

    // Step 2: AI Analysis (Mocking previous run data for now)
    const runAnalysis = async () => {
        setLoading(true);
        setStep(2);
        try {
            // In a real app, fetch these from DB or calculating the draft run results in-memory
            const mockCurrent = { net: 150000, cost: 200000, count: 52, newHires: 2, departures: 0, bonuses: 5000 };
            const mockPrev = { net: 142000, cost: 190000, count: 50, newHires: 0, departures: 0, bonuses: 0 };

            const analysis = await analyzeVariance(mockCurrent, mockPrev);
            setVariance(analysis);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Execution
    const executeRun = async () => {
        setLoading(true);
        try {
            const res = await createPayrollRun(month, year);
            if (res.success) {
                setRunId(res.data.id);
                setStep(3);
            } else {
                alert('Failed: ' + res.error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stepper */}
            <div className="flex justify-between items-center px-10">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-1 border-current">1</div>
                    <span className="text-xs font-medium">Audit</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-1 border-current">2</div>
                    <span className="text-xs font-medium">Review</span>
                </div>
                <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-slate-400'}`}>
                    <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold mb-1 border-current">3</div>
                    <span className="text-xs font-medium">Report</span>
                </div>
            </div>

            {/* Content */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Step 1: Pre-Run Validation"}
                        {step === 2 && "Step 2: Variance Analysis"}
                        {step === 3 && "Step 3: Success & Reporting"}
                    </CardTitle>
                </CardHeader>
                <CardContent>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500">
                                Scanning valid employees for missing statutory requirements (TIN, SSNIT, Ghana Card).
                            </p>

                            {!validation && (
                                <button
                                    onClick={runValidation}
                                    disabled={loading}
                                    className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Start Audit"}
                                </button>
                            )}

                            {validation && validation.valid && (
                                <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3">
                                    <CheckCircle className="w-5 h-5" />
                                    <span>All <b>Active Employees</b> are compliant. Ready to proceed.</span>
                                </div>
                            )}

                            {validation && !validation.valid && (
                                <div className="space-y-3">
                                    <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span>Found {validation.issues.length} compliance issues.</span>
                                    </div>
                                    <div className="border border-slate-200 rounded-lg divide-y">
                                        {validation.issues.map((issue: any) => (
                                            <div key={issue.employeeId} className="p-3">
                                                <p className="font-semibold text-sm">{issue.name}</p>
                                                <p className="text-xs text-red-500">Missing: {issue.missing.join(', ')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <button
                                    onClick={runAnalysis}
                                    disabled={!validation?.valid}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                                >
                                    Next: Analyze
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                                <h3 className="text-purple-800 font-bold flex items-center gap-2 mb-4">
                                    <BrainCircuit className="w-5 h-5" /> AI Variance Report
                                </h3>
                                {loading && !variance ? (
                                    <div className="flex items-center gap-2 text-purple-600">
                                        <Loader2 className="animate-spin w-4 h-4" /> Analyzing payroll data...
                                    </div>
                                ) : (
                                    <div className="prose prose-sm text-purple-900 leading-relaxed whitespace-pre-line">
                                        {variance}
                                    </div>
                                )}
                            </div>

                            <p className="text-xs text-slate-500 text-center">
                                Review the AI insights above. If everything looks correct, commit the payroll run.
                            </p>

                            <div className="flex justify-end pt-4 gap-3">
                                <button onClick={() => setStep(1)} className="text-slate-500 px-4">Back</button>
                                <button
                                    onClick={executeRun}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                                >
                                    Approve & Run Payroll
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">Payroll Executed Successfully!</h3>
                                <p className="text-slate-500">Run ID: {runId}</p>
                            </div>

                            <div className="flex justify-center gap-4 pt-4">
                                <button className="border border-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50">
                                    <Download className="w-4 h-4 text-slate-600" />
                                    GRA Schedule (CSV)
                                </button>
                                <button className="border border-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50">
                                    <Download className="w-4 h-4 text-slate-600" />
                                    SSNIT Report (CSV)
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
