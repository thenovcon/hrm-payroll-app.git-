import { getRecruitmentFunnelStats, getJobStats } from '@/lib/actions/ats-actions';
import RecruitmentFunnelChart from '@/components/ats/RecruitmentFunnelChart';

export default async function ATSAnalyticsPage() {
    const funnelData = await getRecruitmentFunnelStats();
    const jobStats = await getJobStats();

    // Calculate totals
    const totalApplications = funnelData?.reduce((acc, curr) => acc + curr.count, 0) || 0;
    const activeJobs = jobStats.find(s => s.status === 'ACTIVE')?.count || 0;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">Recruitment Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* KPI Cards */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Applications</h3>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{totalApplications}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Job Openings</h3>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">{activeJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Hired This Cycle</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">
                        {funnelData?.find(s => s.stage === 'HIRED')?.count || 0}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold mb-4 text-slate-800">Candidate Pipeline</h2>
                {funnelData && <RecruitmentFunnelChart data={funnelData} />}
            </div>
        </div>
    );
}
