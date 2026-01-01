import { auth } from '@/auth';
import Link from 'next/link';

export default async function MainPage() {
  const session = await auth();

  if (!session?.user) {
    // Soft Fail - Do not redirect, just show status
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Session Check Failed</h1>
        <p className="mb-4">You are hitting /portal, but the server sees no session.</p>

        <div className="bg-gray-100 p-4 rounded mb-4">
          <p><strong>Debug Info:</strong></p>
          <p>User: null</p>
        </div>

        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Try Login Again
        </Link>
      </div>
    );
  }

  console.log('PORTAL_PAGE: Auth Success. User:', session.user.email);
  const userRole = (session.user as any)?.role || 'EMPLOYEE';

  try {
    // If user is an employee, show Agent Portal logic
    if (userRole === 'EMPLOYEE') {
      const { prisma } = await import('@/lib/db/prisma');
      const AgentPortal = (await import('@/components/portal/AgentPortal')).default;

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

      if (user?.employee) {
        const stats = {
          leaveBalance: 15,
          pendingRequests: user.employee.leaveRequests.length,
          trainingProgress: 65,
          attendanceRate: 95
        };
        return <AgentPortal employee={user.employee} stats={stats} />;
      }
    }

    // Admin/HR Dashboard (Default Fallback)
    return (
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-900)' }}>Dashboard</h1>
          <p className="text-gray-500">Welcome to Novcon Ghana HRM & Payroll System</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 className="font-medium text-gray-500">Total Employees</h3>
            <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>142</p>
          </div>
          <div className="card">
            <h3 className="font-medium text-gray-500">Pending Leave</h3>
            <p className="text-2xl font-bold" style={{ marginTop: '0.5rem' }}>8</p>
          </div>
          <div className="card">
            <h3 className="font-medium text-gray-500">System Status</h3>
            <p className="text-xl font-bold text-green-600" style={{ marginTop: '0.5rem' }}>Operational</p>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="p-10">
        <h1 className="text-red-500 font-bold">Database Error</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}
