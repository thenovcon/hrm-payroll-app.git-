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
    // Force Mock Data for Demo
    const mockRequests = [
        // My Requests
        { id: 'm1', type: 'ANNUAL', startDate: new Date(2025, 5, 10), endDate: new Date(2025, 5, 15), status: 'APPROVED', managerApprovalStatus: 'APPROVED', hrApprovalStatus: 'APPROVED', reason: 'Summer Vacation', employeeId: employeeId, employee: { firstName: 'Kwame', lastName: 'Mensah' } },
        { id: 'm2', type: 'SICK', startDate: new Date(2025, 8, 2), endDate: new Date(2025, 8, 3), status: 'PENDING', managerApprovalStatus: 'PENDING', hrApprovalStatus: 'PENDING', reason: 'Malaria Treatment', employeeId: employeeId, employee: { firstName: 'Kwame', lastName: 'Mensah' } },

        // Admin Queue (HR Pending)
        { id: 'm3', type: 'MATERNITY', startDate: new Date(2025, 10, 1), endDate: new Date(2026, 1, 1), status: 'PENDING', managerApprovalStatus: 'APPROVED', hrApprovalStatus: 'PENDING', reason: 'Maternity Leave', employeeId: 'emp_other', employee: { firstName: 'Ama', lastName: 'Sarpong' } },
        { id: 'm4', type: 'CASUAL', startDate: new Date(2025, 9, 20), endDate: new Date(2025, 9, 22), status: 'PENDING', managerApprovalStatus: 'APPROVED', hrApprovalStatus: 'PENDING', reason: 'Emergency Family Issue', employeeId: 'emp_other_2', employee: { firstName: 'Kojo', lastName: 'Antwi' } },
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
                { id: 'b1', year: 2025, daysAllocated: 20, daysUsed: 5, leaveType: { name: 'Annual Leave' } },
                { id: 'b2', year: 2025, daysAllocated: 10, daysUsed: 2, leaveType: { name: 'Sick Leave' } },
                { id: 'b3', year: 2025, daysAllocated: 5, daysUsed: 3, leaveType: { name: 'Casual Leave' } },
                { id: 'b4', year: 2024, daysAllocated: 20, daysUsed: 18, leaveType: { name: 'Annual Leave' } }, // History
                { id: 'b5', year: 2024, daysAllocated: 10, daysUsed: 4, leaveType: { name: 'Sick Leave' } }, // History
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
