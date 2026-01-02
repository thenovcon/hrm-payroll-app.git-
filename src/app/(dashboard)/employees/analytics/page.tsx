import { auth } from '@/auth';
import { getWorkforceComposition } from '@/lib/analytics';
import { notFound } from 'next/navigation';

export default async function WorkforceAnalyticsPage() {
    const session = await auth();
    if (!session?.user) return notFound();

    // TODO: Dept restriction
    const { byGender, byTenure } = await getWorkforceComposition();

    const DemographicsCharts = (await import('@/components/employees/DemographicsCharts')).default;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Workforce Composition</h1>
                    <p className="text-slate-500">Demographics and diversity insights.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender Distribution */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Gender Distribution</h3>
                    <DemographicsCharts data={byGender} type="pie" colors={['#3b82f6', '#ec4899']} />
                </div>

                {/* Tenure */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Tenure Breakdown</h3>
                    <DemographicsCharts data={byTenure} type="bar" colors={['#10b981', '#34d399', '#6ee7b7', '#a7f3d0']} />
                </div>
            </div>
        </div>
    );
}
