import { auth } from '@/auth';
import { getRecruitmentFunnel } from '@/lib/analytics';
import { notFound } from 'next/navigation';

export default async function RecruitmentAnalyticsPage() {
    const session = await auth();
    if (!session?.user) return notFound();

    // TODO: Actual Dept Check logic (placeholder for now)
    // const userDeptId = (session.user as any).departmentId;
    const metrics = await getRecruitmentFunnel();

    const FunnelChart = (await import('@/components/ats/FunnelChart')).default;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Recruitment Analytics</h1>
                    <p className="text-slate-500">Pipeline health and conversion rates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((stage) => (
                    <div key={stage.stage} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                        <h3 className="text-slate-500 text-sm font-medium">{stage.stage}</h3>
                        <span className="text-3xl font-bold text-slate-800 mt-2 block">{stage.count}</span>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Recruitment Funnel</h3>
                <FunnelChart data={metrics} />
            </div>
        </div>
    );
}
