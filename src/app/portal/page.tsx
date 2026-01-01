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
    <div className="container mx-auto space-y-8 p-6 max-w-7xl animate-in fade-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-2xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">Executive Overview</h1>
          <p className="text-slate-300 text-lg font-light">Real-time insights across your organization.</p>
        </div>
        <div className="mt-6 md:mt-0 relative z-10 text-right">
          <div className="inline-flex flex-col items-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Logged In As</span>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-lg font-medium text-white">{session.user.name || session.user.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Workforce Card */}
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total Workforce</p>
                <h3 className="text-4xl font-extrabold text-slate-900">{employeeCount}</h3>
              </div>
              <div className="p-3 bg-blue-100/50 rounded-lg text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-slate-500 font-medium">Active Employees</span>
            </div>
          </div>
        </div>

        {/* ATS Card */}
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Recruitment</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-extrabold text-slate-900">{activeJobs}</h3>
                  <span className="text-sm text-slate-400 font-medium">Jobs</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100/50 rounded-lg text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-50">
              <span className="text-slate-500">Total Applications</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{totalApplications}</span>
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Present Today</p>
                <h3 className="text-4xl font-extrabold text-slate-900">{attendanceToday}</h3>
              </div>
              <div className="p-3 bg-teal-100/50 rounded-lg text-teal-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${Math.min((attendanceToday / (employeeCount || 1)) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">Daily Attendance Rate</p>
          </div>
        </div>

        {/* Leave Card */}
        <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Pending Leave</p>
                <h3 className="text-4xl font-extrabold text-slate-900">{pendingLeave}</h3>
              </div>
              <div className="p-3 bg-orange-100/50 rounded-lg text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div className="text-sm">
              {pendingLeave > 0 ? (
                <span className="text-orange-600 font-bold flex items-center animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                  Action Required
                </span>
              ) : (
                <span className="text-slate-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  All Caught Up
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Payroll Status */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:border-blue-200 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="font-bold text-slate-800">Payroll Status</h3>
            </div>
            {payrollStatus ? (
              <div className="space-y-4">
                <div className="flex justify-end items-end">
                  <span className="text-4xl font-mono font-bold text-slate-800 tracking-tighter">{payrollStatus.month}/{payrollStatus.year}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No historical runs available.</p>
            )}
          </div>
          {payrollStatus && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-500 uppercase">Current Status</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${payrollStatus.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                {payrollStatus.status}
              </span>
            </div>
          )}
        </div>

        {/* Performance Cycle */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:border-indigo-200 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <h3 className="font-bold text-slate-800">Performance</h3>
            </div>
            {performanceCycle ? (
              <div className="flex flex-col">
                <span className="text-lg font-medium text-slate-800 leading-snug">{performanceCycle.name}</span>
                <span className="text-xs text-indigo-500 font-bold mt-1 uppercase tracking-wide">Active Cycle</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <span className="text-slate-300 mb-2">●</span>
                <p className="text-sm text-slate-500">No active cycles.</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-end w-full group">
              View Details
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        </div>

        {/* Training Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:border-red-200 transition-colors">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="font-bold text-slate-800">LMS & Training</h3>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-sm">Available Courses</span>
              <span className="text-3xl font-bold text-slate-800">{trainingStats}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              {/* Placeholder progress bar for visual flair */}
              <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">65% Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Reports Action Area */}
      <div className="bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl font-bold text-slate-900">Need detailed analytics?</h3>
          <p className="text-slate-500">Generate comprehensive reports across all HR modules.</p>
        </div>
        <a href="/reports" className="group inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl">
          Go to Reports Center
          <svg className="ml-2 -mr-1 w-5 h-5 group-hover:ml-3 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
      </div>

    </div>
  );
}
