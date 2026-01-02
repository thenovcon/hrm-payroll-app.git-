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
  const { getFinancialMetrics, getComplianceMetrics, getAttritionMetrics } = await import('@/lib/metrics');

  // Parallel Fetching for Dashboard Stats
  let employeeCount = 0;
  let recruitmentStats: any[] = [];
  let attendanceToday = 0;
  let financials: { totalCost: number, month?: number } = { totalCost: 0, month: 0 };
  let compliance = { totalRisks: 0 };
  let attrition = { netChange: 0, hires: 0, terminations: 0 };
  let payrollRuns: any[] = [];
  let departments: any[] = [];
  let attendanceRecords: any[] = [];
  let applicationTrendsData: any[] = [];

  try {
    [
      employeeCount,
      recruitmentStats,
      attendanceToday,
      financials,
      compliance,
      attrition,
      payrollRuns,
      departments,
      attendanceRecords,
      applicationTrendsData
    ] = await Promise.all([
      // 1. Employees
      prisma.employee.count({ where: { status: 'ACTIVE' } }),

      // 2. ATS (Recruitment)
      prisma.jobPosting.findMany({
        where: { status: 'ACTIVE' },
        select: {
          _count: { select: { applications: { where: { status: 'APPLIED' } } } }
        }
      }),

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

      // 4. Financials
      getFinancialMetrics().catch(() => ({ totalCost: 0, month: 0 })),

      // 5. Compliance
      getComplianceMetrics().catch(() => ({ totalRisks: 0 })),

      // 6. Attrition
      getAttritionMetrics().catch(() => ({ netChange: 0, hires: 0, terminations: 0 })),

      // 7. Payroll History for Charts
      prisma.payrollRun.findMany({
        orderBy: { year: 'asc', month: 'asc' },
        take: 6,
        select: { month: true, year: true, totalCost: true }
      }),

      // 8. Department Headcount
      prisma.department.findMany({
        include: {
          _count: { select: { employees: true } }
        }
      }),

      // 9. Attendance Trends (Last 14 days)
      prisma.attendanceRecord.findMany({
        where: {
          date: { gte: new Date(new Date().setDate(new Date().getDate() - 14)) }
        },
        select: { date: true, status: true },
        orderBy: { date: 'asc' }
      }),

      // 10. Application Trends (This Year)
      prisma.application.findMany({
        where: {
          createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) }
        },
        select: { createdAt: true }
      })
    ]);
  } catch (error) {
    console.error("Dashboard Data Fetch Error:", error);
    // Silent fail to allow UI to render with zeros
  }

  // Format Data for Charts
  const chartPayrollData = (payrollRuns || []).map((run: any) => ({
    month: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][run.month - 1] || 'N/A'}`,
    cost: run.totalCost
  }));

  const chartHeadcountData = (departments || []).map((dept: any) => ({
    name: dept.name,
    value: dept._count?.employees || 0
  })).filter((d: any) => d.value > 0);

  // Process Attendance Trends
  const attendanceMap = new Map<string, { date: string, present: number, late: number, absent: number }>();

  (attendanceRecords || []).forEach((record: any) => {
    try {
      const dateStr = record.date.toISOString().split('T')[0];
      const dayLabel = new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });

      if (!attendanceMap.has(dateStr)) {
        attendanceMap.set(dateStr, { date: dayLabel, present: 0, late: 0, absent: 0 });
      }

      const entry = attendanceMap.get(dateStr)!;
      if (record.status === 'PRESENT') entry.present++;
      else if (record.status === 'LATE') entry.late++;
      else if (record.status === 'ABSENT') entry.absent++;
    } catch (e) {
      // Ignore malformed dates
    }
  });

  const chartAttendanceData = Array.from(attendanceMap.values());

  // Process Application Trends (Monthly)
  const applicationTrends = new Array(12).fill(0);
  (applicationTrendsData || []).forEach((app: any) => {
    try {
      const month = new Date(app.createdAt).getMonth();
      if (month >= 0 && month < 12) applicationTrends[month]++;
    } catch (e) { }
  });

  // Normalize Recruitment Data
  const activeJobs = recruitmentStats?.length || 0;
  // Calculate total applications by summing up the counts from recruitmentStats
  const totalApplications = (recruitmentStats || []).reduce((sum, job) => sum + (job._count?.applications || 0), 0);
  const jobViews = 0; // Not tracked in schema yet

  const JobStatsChart = (await import('@/components/dashboard/JobStatsChart')).default;
  const OverviewAnalytics = (await import('@/components/dashboard/OverviewAnalytics')).default;

  return (
    <div className="container mx-auto space-y-6 p-6 max-w-7xl animate-in fade-in duration-500">

      {/* Header with Global Filter Placeholder */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Executive Overview</h2>
          <p className="text-slate-500">Real-time workforce insights and operational pulse.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-300 text-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Quarter to Date</option>
            <option>Year to Date</option>
          </select>
          <button className="bg-white border border-slate-300 text-slate-700 rounded-md px-3 py-1.5 text-sm hover:bg-slate-50">
            Export Report
          </button>
        </div>
      </div>

      {/* 6-Card Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">

        {/* 1. Headcount */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-700">Total Headcount</h3>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center">
                <span className="mr-1">↗</span> 2.5%
              </span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 block mb-1">{employeeCount}</span>
              <span className="text-slate-400 text-sm">Active Employees</span>
            </div>
          </div>
        </div>

        {/* 2. Payroll Cost */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-700">Payroll Cost</h3>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {financials.month ? `Month ${financials.month}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 block mb-1">
                GHS {financials.totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-slate-400 text-sm">Gross + Employer Costs</span>
            </div>
          </div>
        </div>

        {/* 3. Attrition & Hiring */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-700">Attrition vs Hires</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center ${attrition.netChange >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {attrition.netChange >= 0 ? '+' : ''}{attrition.netChange} Net
              </span>
            </div>
            <div className="flex gap-4 items-end">
              <div>
                <span className="text-2xl font-extrabold text-slate-900 block">{attrition.hires}</span>
                <span className="text-slate-400 text-xs uppercase tracking-wider">Hires</span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <span className="text-2xl font-extrabold text-red-600 block">{attrition.terminations}</span>
                <span className="text-slate-400 text-xs uppercase tracking-wider">Exits</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Recruitment Funnel (Summary) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-700">Recruitment</h3>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {activeJobs} Open
              </span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 block mb-1">{totalApplications}</span>
              <span className="text-slate-400 text-sm">Active Candidates</span>
            </div>
          </div>
        </div>

        {/* 5. Attendance & Leave */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-700">Attendance Today</h3>
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
                Live
              </span>
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 block mb-1">{attendanceToday}</span>
              <span className="text-slate-400 text-sm">Present On-Site</span>
            </div>
          </div>
        </div>

        {/* 6. Compliance Risk */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-700">Compliance Risk</h3>
              {compliance.totalRisks > 0 && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold flex items-center animate-pulse">
                  Action Req.
                </span>
              )}
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900 block mb-1">{compliance.totalRisks}</span>
              <span className="text-slate-400 text-sm">Pending Items / Exceptions</span>
            </div>
          </div>
        </div>

      </div>

      {/* NEW: VISUAL ANALYTICS ROW */}
      <OverviewAnalytics
        payrollHistory={chartPayrollData}
        headcountByDept={chartHeadcountData}
        attendanceTrends={chartAttendanceData}
      />

      {/* Main Chart Section - Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* We want to keep Job Stats or replace it? Keeping it for detailed view below the main analytics */}
          <JobStatsChart views={jobViews} applied={totalApplications} data={applicationTrends} />
        </div>

        {/* Helper Widgets Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Action Queue</h3>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">4 Tasks</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Approve Leave Request</p>
                  <p className="text-xs text-slate-500">Kwame Mensah • Annual Leave</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Payroll Draft Review</p>
                  <p className="text-xs text-slate-500">Dec 2025 • Pending Approval</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
            <h3 className="font-bold text-slate-800 mb-2">Quick Access</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="/ats/post-job" className="p-3 bg-gray-50 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-md hover:text-primary-600 transition-all border border-transparent hover:border-slate-100">Post Job</a>
              <a href="/employees/new" className="p-3 bg-gray-50 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-md hover:text-primary-600 transition-all border border-transparent hover:border-slate-100">Add Employee</a>
              <a href="/payroll/run" className="p-3 bg-gray-50 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-md hover:text-primary-600 transition-all border border-transparent hover:border-slate-100">Run Payroll</a>
              <a href="/reports" className="p-3 bg-gray-50 rounded-lg text-sm font-medium text-slate-600 hover:bg-white hover:shadow-md hover:text-primary-600 transition-all border border-transparent hover:border-slate-100">All Reports</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
