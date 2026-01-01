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
    <div className="container mx-auto space-y-8 p-6 max-w-7xl animate-in fade-in duration-500 bg-slate-50 min-h-screen">

      {/* Premium Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-8 rounded-3xl shadow-2xl text-white relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 opacity-20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md border border-white/20 text-indigo-200">
              Executive Dashboard
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 mb-2">
            Executive Overview
          </h1>
          <p className="text-slate-300 text-lg font-light max-w-xl leading-relaxed">
            Real-time strategic insights across your workforce, recruitment, and operations.
          </p>
        </div>

        <div className="mt-8 md:mt-0 relative z-10">
          <div className="flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-transform hover:scale-105">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold shadow-inner ring-2 ring-white/20">
              {session.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">{session.user.name || session.user.email}</span>
              <span className="text-xs text-indigo-300 font-medium mt-1">{(session.user as any).role || 'Administrator'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid - Glassmorphism & Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Workforce Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full -mr-8 -mt-8 opacity-50 blur-xl transition-transform group-hover:scale-110"></div>

          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Total Workforce</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{employeeCount}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg text-white shadow-blue-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-xs text-blue-700 font-bold">Active Employees</span>
            </div>
          </div>
        </div>

        {/* ATS Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-8 -mt-8 opacity-50 blur-xl transition-transform group-hover:scale-110"></div>

          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">Recruitment</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">{activeJobs}</h3>
                  <span className="text-sm text-slate-400 font-medium">Open Roles</span>
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg text-white shadow-purple-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-100">
              <span className="text-slate-500 font-medium">Total Applications</span>
              <span className="font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">{totalApplications}</span>
            </div>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-white opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-bl-full -mr-8 -mt-8 opacity-50 blur-xl transition-transform group-hover:scale-110"></div>

          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Present Today</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{attendanceToday}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg text-white shadow-teal-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((attendanceToday / (employeeCount || 1)) * 100, 100)}%` }}></div>
            </div>
            <p className="text-xs text-teal-600 font-bold mt-2 text-right">Daily Attendance Rate</p>
          </div>
        </div>

        {/* Leave Card */}
        <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-50"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-bl-full -mr-8 -mt-8 opacity-50 blur-xl transition-transform group-hover:scale-110"></div>

          <div className="relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Pending Leave</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{pendingLeave}</h3>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg text-white shadow-orange-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <div className="text-sm">
              {pendingLeave > 0 ? (
                <span className="text-white bg-orange-500 px-3 py-1 rounded-full font-bold text-xs flex items-center w-fit shadow-md animate-pulse">
                  Action Required
                </span>
              ) : (
                <span className="text-slate-400 flex items-center font-medium">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  All Caught Up
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Grid - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Payroll Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all duration-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Payroll Status</h3>
            </div>
            {payrollStatus ? (
              <div className="space-y-4">
                <div className="flex justify-center items-center py-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                  <span className="text-3xl font-mono font-bold text-slate-700 tracking-tighter">{payrollStatus.month} / {payrollStatus.year}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">No historical runs available.</p>
            )}
          </div>
          {payrollStatus && (
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Current Status</span>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border ${payrollStatus.status === 'PAID' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                {payrollStatus.status}
              </span>
            </div>
          )}
        </div>

        {/* Performance Cycle */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Performance</h3>
            </div>
            {performanceCycle ? (
              <div className="flex flex-col p-4 bg-indigo-50/50 rounded-xl border border-indigo-50">
                <span className="text-lg font-bold text-slate-900 leading-snug">{performanceCycle.name}</span>
                <span className="text-xs text-indigo-500 font-bold mt-1 uppercase tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> Active Cycle
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500 font-medium">No active cycles initialized.</p>
              </div>
            )}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg flex items-center justify-center w-full transition-colors shadow-lg shadow-indigo-100">
              View Analytics
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
            </button>
          </div>
        </div>

        {/* Training Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between hover:shadow-xl hover:border-rose-200 transition-all duration-300">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">LMS & Training</h3>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50/50 rounded-xl border border-rose-50">
              <span className="text-slate-500 text-sm font-medium">Active Courses</span>
              <span className="text-3xl font-black text-rose-600">{trainingStats}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-400 to-rose-600 h-2 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-rose-500 font-bold mt-2 text-right">65% Completion Rate</p>
          </div>
        </div>
      </div>

      {/* Reports Action Area - Premium */}
      <div className="relative overflow-hidden bg-slate-900 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 mb-6 md:mb-0">
          <h3 className="text-2xl font-bold text-white mb-2">Detailed Strategic Analytics</h3>
          <p className="text-slate-400 max-w-lg">Generate comprehensive reports across all HR modules to drive data-informed decisions.</p>
        </div>
        <a href="/reports" className="relative z-10 group inline-flex items-center justify-center px-8 py-4 border border-white/20 text-base font-bold rounded-xl text-slate-900 bg-white hover:bg-slate-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transform hover:-translate-y-1">
          Access Reports Center
          <svg className="ml-2 -mr-1 w-5 h-5 group-hover:ml-3 transition-all text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
      </div>

    </div>
  );
}
