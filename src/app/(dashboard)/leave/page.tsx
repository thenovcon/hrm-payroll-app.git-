import LeaveDashboard from '@/components/leave/LeaveDashboard';
import { seedLeaveTypes } from '@/lib/actions/seedLeave';
import { getLeaveRequests, getLeaveBalances } from '@/lib/actions/leave';
import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';

export default async function LeavePage({ searchParams }: { searchParams: { seed?: string } }) {
    const session = await auth();
    const userId = session?.user?.id;

    // Fetch User with Employee details
    const user = userId ? await prisma.user.findUnique({
        where: { id: userId },
        include: { employee: true }
    }) : null;

    const employeeId = user?.employeeId;
    const role = user?.role || 'EMPLOYEE';

    // Simple mechanism to trigger seed via URL query for initial setup
    if (searchParams?.seed === 'true') {
        await seedLeaveTypes();
    }

    const result = await getLeaveRequests(); // Fetches all for filtering in dashboard (simplified for demo)

    // Use real data if available, else empty
    const requests = (result.success && result.data) ? result.data : [];

    // Fetch Leave Types for Modal
    const typesResult = await import('@/lib/actions/leave').then(mod => mod.getLeaveTypes());
    const leaveTypes = (typesResult.success && typesResult.data) ? typesResult.data : [];

    // Fetch Balances if employee exists
    let balances: any[] = [];
    if (employeeId) {
        const balanceResult = await getLeaveBalances(employeeId);
        if (balanceResult.success && balanceResult.data) {
            balances = balanceResult.data;
        }
    }

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
                userId={userId || ''}
                employeeId={employeeId || ''}
                role={role}
                balances={balances}
                leaveTypes={leaveTypes}
            />
        </div>
    );
}
