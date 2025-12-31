import LeaveDashboard from '@/components/leave/LeaveDashboard';
import { seedLeaveTypes } from '@/lib/actions/seedLeave';
import { getLeaveRequests } from '@/lib/actions/leave';
import { auth } from '@/auth';

export default async function LeavePage({ searchParams }: { searchParams: { seed?: string } }) {
    const session = await auth();

    // Simple mechanism to trigger seed via URL query for initial setup
    if (searchParams?.seed === 'true') {
        await seedLeaveTypes();
    }

    const result = await getLeaveRequests();
    const requests = result.success ? result.data : [];

    return (
        <div className="container" style={{ paddingBottom: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Leave Management</h1>
                <p className="text-gray-500">Track balance, apply for leaves, and manage approvals in a multi-stage workflow.</p>

                {/* Hidden helper for dev seeding */}
                <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--slate-400)' }}>
                    System check: <a href="/leave?seed=true" style={{ textDecoration: 'underline' }}>Initialize Default Leave Types</a>
                </p>
            </div>

            <LeaveDashboard
                requests={requests as any[]}
                userId={session?.user?.id || ''}
                role={(session?.user as any)?.role || 'EMPLOYEE'}
            />
        </div>
    );
}
