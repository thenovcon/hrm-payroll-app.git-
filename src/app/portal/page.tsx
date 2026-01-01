import { auth } from '@/auth';
import { prisma } from '@/lib/db/prisma';
import AgentPortal from '@/components/portal/AgentPortal';
import Link from 'next/link';

export default async function Home() {
  console.log('PORTAL_PAGE: Starting render...');

  try {
    const session = await auth();
    console.log('PORTAL_PAGE: Session retrieved:', session?.user?.email);

    if (!session?.user) {
      console.log('PORTAL_PAGE: No user found. Rendering Login prompt.');
      // TEMPORARY: Do not redirect, just show UI to confirm page loads
      return (
        <div className="p-10 text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied (Debug Mode)</h1>
          <p>You are not logged in.</p>
          <Link href="/login" className="text-blue-600 underline">Go to Login</Link>
        </div>
      );
    }

    const userRole = (session?.user as any)?.role || 'EMPLOYEE';
    console.log('PORTAL_PAGE: User role:', userRole);

    // If user is an employee, show Agent Portal
    if (userRole === 'EMPLOYEE') {
      console.log('PORTAL_PAGE: Fetching employee data...');
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          employee: {
            include: {
              department: true,
              leaveRequests: { where: { status: 'PENDING' } },
              enrollments: { where: { status: { in: ['ENROLLED', 'IN_PROGRESS'] } } }
            }
          }
        }
      });
      console.log('PORTAL_PAGE: User data fetched:', user?.id);

      if (user?.employee) {
        const stats = {
          leaveBalance: 15, // TODO: Calculate from LeaveBalance
          pendingRequests: user.employee.leaveRequests.length,
          trainingProgress: 65, // TODO: Calculate from Enrollments
          attendanceRate: 95 // TODO: Calculate from AttendanceRecords
        };

        return <AgentPortal employee={user.employee} stats={stats} />;
      } else {
        console.log('PORTAL_PAGE: User has no employee record.');
        return <div className="p-10">User found, but no Employee record linked.</div>
      }
    }

    // Admin/HR Dashboard
    return (
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Dashboard</h1>
          <p className="text-gray-500">Welcome to Novcon Ghana HRM & Payroll System</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Quick Stats Cards */}
          <div className="card">
            <h3 className="font-medium text-gray-500">Total Employees</h3>
            <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>142</p>
            <span style={{ fontSize: '0.875rem', color: 'var(--accent-teal)' }}>+4 new this month</span>
          </div>

          <div className="card">
            <h3 className="font-medium text-gray-500">Pending Leave</h3>
            <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>8</p>
            <span style={{ fontSize: '0.875rem', color: 'var(--accent-amber)' }}>Requires approval</span>
          </div>

          <div className="card">
            <h3 className="font-medium text-gray-500">Next Payroll</h3>
            <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>Jan 25</p>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary-600)' }}>24 days remaining</span>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error('PORTAL_PAGE: CRITICAL ERROR:', error);
    return (
      <div className="p-10">
        <h1 className="text-red-500 font-bold">Server Error in Portal Page</h1>
        <pre>{error.message}</pre>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}
