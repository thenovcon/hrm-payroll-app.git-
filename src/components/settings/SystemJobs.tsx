'use client';

import React, { useState } from 'react';
import { checkAndSendFeedbackReminders } from '@/lib/actions/feedback-scheduler';

export default function SystemJobs() {
    const [loading, setLoading] = useState(false);
    const [lastRun, setLastRun] = useState<string | null>(null);
    const [result, setResult] = useState<any>(null);

    const handleRunFeedbackReminders = async () => {
        setLoading(true);
        try {
            const res = await checkAndSendFeedbackReminders();
            setLastRun(new Date().toLocaleString());
            setResult(res);
        } catch (error) {
            console.error(error);
            setResult({ success: false, error: 'Job failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">System Maintenance Jobs</h2>
            <p className="text-slate-500 mb-6">Manually trigger background jobs that usually run via cron.</p>

            <div className="grid gap-4">
                <div className="card p-4 flex justify-between items-center">
                    <div>
                        <h3 className="font-medium">360 Feedback Reminders</h3>
                        <p className="text-sm text-slate-500"> Checks active cycles and emails providers with pending feedback.</p>
                        {lastRun && <p className="text-xs text-green-600 mt-1">Last run: {lastRun}</p>}
                        {result && (
                            <div className="mt-2 text-xs bg-slate-50 p-2 rounded">
                                <p>Status: {result.success ? 'Success' : 'Failed'}</p>
                                <p>Emails Sent: {result.results?.length || 0}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleRunFeedbackReminders}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Running...' : 'Run Job Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
