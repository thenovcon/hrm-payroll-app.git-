import { getWorkforceStats } from '@/lib/actions/analytics-actions';
import WorkforceCharts from '@/components/analytics/WorkforceCharts';

export default async function WorkforceAnalyticsPage() {
    const stats = await getWorkforceStats();

    if (!stats) return <div className="p-6">Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Workforce Composition Analytics</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Employees</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalHeadcount}</p>
                </div>

                {/* We can add more specific KPIs here later like turnover rate */}
                <div className="md:col-span-3 bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center">
                    <p className="text-indigo-700 text-sm">
                        Total Headcount reflects all currently active employees. Department and Tenure breakdowns allow for better resource planning.
                    </p>
                </div>
            </div>

            {/* Visualizations */}
            <WorkforceCharts
                genderData={stats.genderData}
                deptData={stats.deptData}
                tenureData={stats.tenureData}
            />
        </div>
    );
}
