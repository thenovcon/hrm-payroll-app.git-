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
            enrollments: { where: { status: { in: ['ENROLLED', 'IN_PROGRESS'] } } },
            skills: { include: { skill: true } },
            attendance: {
              where: { date: { gte: new Date(new Date().setDate(1)) } }, // Current month
              orderBy: { date: 'asc' }
            }
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
      return <AgentPortal employee={user.employee} stats={stats} attendance={user.employee.attendance} skills={user.employee.skills} />;
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

  // Format Data for Modern Dashboard
  // Force Rich Mock Data for Demo Purposes (User Request: "populate some dummy data")
  const demoMode = true;

  const modernMetrics = {
    headcount: employeeCount || 142,
    payrollCost: financials.totalCost || 452000,
    attendanceRate: 94.2,
    openJobs: activeJobs || 7
  };

  const modernTrends = {
    payroll: chartPayrollData.length > 0 ? chartPayrollData : [
      { month: 'Jun', cost: 410000 },
      { month: 'Jul', cost: 415000 },
      { month: 'Aug', cost: 422000 },
      { month: 'Sep', cost: 430000 },
      { month: 'Oct', cost: 445000 },
      { month: 'Nov', cost: 452000 },
    ],
    headcountByDept: chartHeadcountData.length > 0 ? chartHeadcountData : [
      { name: 'Engineering', value: 45 },
      { name: 'Sales', value: 32 },
      { name: 'Marketing', value: 18 },
      { name: 'HR', value: 12 },
      { name: 'Finance', value: 15 },
      { name: 'Product', value: 20 },
    ],
    attendance: chartAttendanceData.length > 0 ? chartAttendanceData : Array.from({ length: 14 }).map((_, i) => ({
      date: new Date(Date.now() - (13 - i) * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      present: 130 + Math.floor(Math.random() * 10),
    })),
    applications: applicationTrends.some(v => v > 0) ? applicationTrends : [
      12, 19, 3, 5, 2, 3, 15, 22, 28, 35, 42, 50
    ]
  };

  // Additional Mock Data for Charts requested by User
  const extraCharts = {
    recruitmentVelocity: [
      { role: 'Senior Dev', days: 45 },
      { role: 'Product Mgr', days: 38 },
      { role: 'Sales rep', days: 22 },
      { role: 'Designer', days: 28 },
    ],
    budgetVsActual: [
      { month: 'Jun', budget: 420, actual: 410 },
      { month: 'Jul', budget: 420, actual: 415 },
      { month: 'Aug', budget: 430, actual: 422 },
      { month: 'Sep', budget: 440, actual: 430 },
      { month: 'Oct', budget: 450, actual: 445 },
      { month: 'Nov', budget: 460, actual: 452 },
    ],
    goalCompletion: [
      { dept: 'Eng', completed: 85, total: 100 },
      { dept: 'Sales', completed: 92, total: 100 },
      { dept: 'Mkt', completed: 78, total: 100 },
      { dept: 'HR', completed: 95, total: 100 },
    ]
  };

  // Dynamic Import
  const ModernSaaSDashboard = (await import('@/components/dashboard/ModernSaaSDashboard')).default;

  return (
    <div className="animate-in fade-in duration-500">
      <ModernSaaSDashboard
        metrics={modernMetrics}
        trends={modernTrends}
        extraCharts={extraCharts}
        recentActivity={[]} // Will use internal mocks for layout
        userRole={userRole}
      />
    </div>
  );
}
