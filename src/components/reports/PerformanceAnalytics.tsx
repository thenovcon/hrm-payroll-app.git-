'use client';

import { useState, useEffect } from 'react';
import { getGoalStatsByDepartment } from '@/lib/actions/report-actions';
import GoalCompletionChart from '@/components/reports/GoalCompletionChart';

export default function PerformanceAnalytics() {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGoalStatsByDepartment().then(res => {
            if (res.success) setStats(res.data || []);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center">Loading performance data...</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Performance & Goals Analytics</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Goal Completion Chart */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h3 className="font-semibold text-slate-700 mb-4">Goal Completion by Department</h3>
                    <GoalCompletionChart data={stats} />
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 gap-4 h-fit">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-blue-800 font-medium">Total Achieved Goals</h4>
                        <p className="text-2xl font-bold text-blue-900 mt-1">
                            {stats.reduce((acc, curr) => acc + curr.totalGoals * (curr.completionRate / 100), 0).toFixed(0)}
                            {/* Simple approximation for demo, ideally backend sends this */}
                        </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                        <h4 className="text-purple-800 font-medium">Top Performing Dept</h4>
                        <p className="text-lg font-bold text-purple-900 mt-1">
                            {stats.sort((a, b) => b.completionRate - a.completionRate)[0]?.name || 'N/A'}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
