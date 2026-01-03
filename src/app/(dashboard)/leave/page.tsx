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

    // Force Mock Data for Demo
    const mockRequests = [
        { id: 'm1', type: 'ANNUAL', startDate: new Date(2025, 5, 10), endDate: new Date(2025, 5, 15), status: 'APPROVED', reason: 'Summer Vacation', employee: { firstName: 'Kwame', lastName: 'Mensah' } },
        { id: 'm2', type: 'SICK', startDate: new Date(2025, 8, 2), endDate: new Date(2025, 8, 3), status: 'PENDING', reason: 'Malaria Treatment', employee: { firstName: 'Abena', lastName: 'Osei' } },
        { id: 'm3', type: 'CASUAL', startDate: new Date(2025, 9, 20), endDate: new Date(2025, 9, 20), status: 'REJECTED', reason: 'Personal errands', employee: { firstName: 'Kojo', lastName: 'Antwi' } },
        { id: 'm4', type: 'MATERNITY', startDate: new Date(2025, 10, 1), endDate: new Date(2026, 1, 1), status: 'APPROVED', reason: 'Maternity Leave', employee: { firstName: 'Ama', lastName: 'Sarpong' } },
    ];

    // Use real data if available, else mock
    const requests = (result.success && result.data && result.data.length > 0) ? result.data : mockRequests;

    // Fetch Balances if employee exists
    let balances: any[] = [];
    if (employeeId) {
        const balanceResult = await getLeaveBalances(employeeId);
        if (balanceResult.success && balanceResult.data && balanceResult.data.length > 0) {
            balances = balanceResult.data;
        } else {
            // Mock Balances
            balances = [
                { leaveType: { name: 'Annual Leave' }, used: 5, allowance: 20 },
                { leaveType: { name: 'Sick Leave' }, used: 2, allowance: 10 },
                { leaveType: { name: 'Casual Leave' }, used: 3, allowance: 5 },
                { leaveType: { name: 'Study Leave' }, used: 0, allowance: 10 },
            ];
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
            />
        </div>
    );
}
