import { auth } from '@/auth';
import { getPolicies, deletePolicy } from '@/lib/actions/policy-actions';
import { seedPolicies } from '@/lib/actions/seedPolicies';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PoliciesPage({ searchParams }: { searchParams: { seed?: string } }) {
    const session = await auth();
    if (!session) redirect('/login');

    if (searchParams?.seed === 'true') {
        await seedPolicies();
    }

    let policies: any[] = [];
    try {
        policies = await getPolicies();
    } catch (error) {
        console.error("Failed to fetch policies:", error);
    }
    const canEdit = (session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'HR_MANAGER';

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">HR Policies</h1>
                    <p className="text-slate-500 mt-1">
                        Central repository for company guidelines and compliance documents.
                        <a href="/policies?seed=true" className="text-xs text-blue-400 ml-2 hover:text-blue-600 font-medium">(Populate Demo Data)</a>
                    </p>
                </div>
                {canEdit && (
                    <Link href="/policies/new" className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">
                        <span>+</span> New Policy
                    </Link>
                )}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center max-w-2xl">
                <div className="flex-1 px-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input type="text" placeholder="Search policies, handbooks..." className="w-full py-2 bg-transparent outline-none text-slate-700 placeholder:text-slate-400" />
                </div>
                <div className="h-8 w-px bg-slate-100 mx-2"></div>
                <select className="px-4 py-2 bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer hover:text-blue-600">
                    <option>All Categories</option>
                    <option>Conduct</option>
                    <option>Benefits</option>
                </select>
            </div>

            {/* Policies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map((policy, idx) => (
                    <div key={policy.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300 relative overflow-hidden flex flex-col">

                        {/* Interactive Hover Effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 content-['']"></div>

                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner ${idx % 3 === 0 ? 'bg-blue-50 text-blue-600' :
                                    idx % 3 === 1 ? 'bg-purple-50 text-purple-600' :
                                        'bg-emerald-50 text-emerald-600'
                                }`}>
                                📄
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                {policy.category}
                            </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {policy.title}
                        </h3>

                        <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6 flex-grow">
                            {policy.content}
                        </p>

                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                            {policy.fileUrl ? (
                                <a href={policy.fileUrl} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Download
                                </a>
                            ) : (
                                <span className="text-xs text-slate-400 italic">Text only</span>
                            )}

                            {canEdit && (
                                <form action={async () => {
                                    'use server';
                                    await deletePolicy(policy.id);
                                }}>
                                    <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Delete Policy">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {policies.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <span className="text-3xl">📚</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Policies Found</h3>
                    <p className="text-slate-500 mb-6 text-center max-w-sm">
                        Get started by adding your first policy document or generating sample data.
                    </p>
                    {canEdit && (
                        <div className="flex gap-4">
                            <Link href="/policies/new" className="px-5 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 shadow-sm transition">
                                Create Manually
                            </Link>
                            <a href="/policies?seed=true" className="px-5 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                                Seed Demo Data
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
