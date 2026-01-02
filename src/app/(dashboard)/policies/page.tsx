import { auth } from '@/auth';
import { getPolicies, deletePolicy } from '@/lib/actions/policy-actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function PoliciesPage() {
    const session = await auth();
    if (!session) redirect('/login');

    let policies: any[] = [];
    try {
        policies = await getPolicies();
    } catch (error) {
        console.error("Failed to fetch policies:", error);
    }
    const canEdit = (session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'HR_MANAGER';

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">HR Policies & AI Knowledge Base</h1>
                    <p className="text-gray-500">Manage documents that the AI Assistant uses to answer questions.</p>
                </div>
                {canEdit && (
                    <Link href="/policies/new" className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700">
                        + Add Policy
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {policies.map(policy => (
                    <div key={policy.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg text-gray-800 mb-2">{policy.title}</h3>
                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">{policy.category}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-3 mb-4">{policy.content}</p>

                        {policy.fileUrl && (
                            <a href={policy.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 mb-4 bg-blue-50 px-2 py-1 rounded">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Download PDF
                            </a>
                        )}

                        <div className="flex justify-between items-center mt-auto">
                            <span className="text-xs text-gray-400">ID: {policy.id.substring(0, 8)}...</span>
                            {canEdit && (
                                <form action={async () => {
                                    'use server';
                                    await deletePolicy(policy.id);
                                }}>
                                    <button className="text-red-500 text-sm hover:underline">Delete</button>
                                </form>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {policies.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No policies found. The AI has no knowledge yet.</p>
                    {canEdit && (
                        <Link href="/policies/new" className="text-primary-600 font-medium hover:underline">
                            Add your first policy
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
