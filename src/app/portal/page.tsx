import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function MainPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userRole = (session.user as any)?.role || 'EMPLOYEE';

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
  const { prisma } = await import('@/lib/db/prisma');

  // Parallel Fetching for Dashboard Stats
  const [
    employeeCount,
    pendingLeave,
    attendanceToday,
    recruitmentStats,
    payrollStatus,
    trainingStats,
    performanceCycle
  ] = await Promise.all([
    // 1. Employees
    prisma.employee.count({ where: { status: 'ACTIVE' } }),

    // 2. Leave
    prisma.leaveRequest.count({ where: { status: 'PENDING' } }),

    // 3. Attendance (Present Today)
    prisma.attendanceRecord.count({
      where: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999))
        },
        status: 'PRESENT'
      }
    }),

    // 4. ATS (Recruitment)
    prisma.jobPosting.findMany({
      where: { status: 'ACTIVE' },
      select: {
        _count: { select: { applications: { where: { status: 'APPLIED' } } } }
      }
    }),

    // 5. Payroll (Latest Run)
    prisma.payrollRun.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { month: true, year: true, status: true }
    }),

    // 6. Training (Active Courses)
    prisma.trainingCourse.count(),

    // 7. Performance (Active Cycle)
    prisma.performanceCycle.findFirst({
      where: { status: 'ACTIVE' },
      select: { name: true }
    })
  ]);

  // Normalize Recruitment Data
  const activeJobs = recruitmentStats.length;
  const totalApplications = recruitmentStats.reduce((acc, job) => acc + job._count.applications, 0);

  return (
    <div className="container space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Executive Dashboard</h1>
          <p className="text-slate-500 mt-1">Overview of HR Operations & Metrics</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-slate-400 block uppercase tracking-wider">Current User</span>
          <span className="text-lg font-bold text-primary-600">{session.user.name || session.user.email}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Employees Widget */}
        <div className="card p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase">Total Employees</p>
              <h3 className="text-3xl font-bold text-slate-800">{employeeCount}</h3>
            </div>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-sm text-green-600 font-medium">
            Active Workforce
          </div>
        </div>

        {/* ATS Widget */}
        <div className="card p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase">Recruitment</p>
              <h3 className="text-3xl font-bold text-slate-800">{activeJobs}</h3>
            </div>
            <span className="text-2xl">📝</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Active Jobs</span>
            <span className="text-purple-600 font-bold">{totalApplications} Applications</span>
          </div>
        </div>

        {/* Attendance Widget */}
        <div className="card p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase">Attendance Today</p>
              <h3 className="text-3xl font-bold text-slate-800">{attendanceToday}</h3>
            </div>
            <span className="text-2xl">⏰</span>
          </div>
          <div className="text-sm text-slate-500">
            Employees Clocked In
          </div>
        </div>

        {/* Leave Widget */}
        <div className="card p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase">Leave Requests</p>
              <h3 className="text-3xl font-bold text-slate-800">{pendingLeave}</h3>
            </div>
            <span className="text-2xl">🏖️</span>
          </div>
          <div className="text-sm text-orange-600 font-bold">
            Pending Approval
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Payroll Widget */}
        <div className="card p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">💰 Payroll Status</h3>
          {payrollStatus ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Last Run:</span>
                <span className="font-mono font-bold">{payrollStatus.month}/{payrollStatus.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${payrollStatus.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {payrollStatus.status}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No payroll runs yet.</p>
          )}
        </div>

        {/* Performance Widget */}
        <div className="card p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">📈 Performance</h3>
          {performanceCycle ? (
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">Active Cycle</p>
              <p className="text-lg font-medium text-blue-700">{performanceCycle.name}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">No active performance cycles.</p>
          )}
        </div>

        {/* Training Widget */}
        <div className="card p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">🎓 Training & Development</h3>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Available Courses</span>
            <span className="text-2xl font-bold text-slate-800">{trainingStats}</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Check reports for completion rates.</p>
        </div>
      </div>

      {/* Reports Query Link */}
      <div className="card p-6 bg-slate-50 border border-slate-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg text-slate-800">📑 Reports Center</h3>
            <p className="text-sm text-slate-500">Generate detailed reports for all modules.</p>
          </div>
          <a href="/reports" className="px-4 py-2 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 text-slate-700 font-medium">
            View Reports
          </a>
        </div>
      </div>

    </div>
  );
}
