import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTeamOverview, getPendingLeaves, getDeptGoals, getDeptVacancies } from '@/lib/actions/department-actions';
import DeptHeadDashboard from '@/components/dashboard/DeptHeadDashboard';
import GoalReview from '@/components/performance/GoalReview';
import DeptHiringView from '@/components/ats/DeptHiringView';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function TeamPage() {
    const session = await auth();
    const role = session?.user?.role;

    if (role !== 'DEPT_HEAD' && role !== 'ADMIN') {
        redirect('/portal');
    }

    // Parallel Data Fetching for Performance
    const [teamData, pendingLeaves, deptGoals, vacancies] = await Promise.all([
        getTeamOverview(),
        getPendingLeaves(),
        getDeptGoals(),
        getDeptVacancies()
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Command Center</h1>
                <p className="text-muted-foreground">Manage your team's performance, attendance, and hiring pipeline.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview & Attendance</TabsTrigger>
                    <TabsTrigger value="performance">Performance Goals</TabsTrigger>
                    <TabsTrigger value="hiring">Hiring Pipeline</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <DeptHeadDashboard stats={teamData.stats} pendingLeaves={pendingLeaves} />
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-medium mb-4">Goal Approvals & Feedback</h3>
                            <GoalReview goals={deptGoals} />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-4">Department Objectives</h3>
                            {/* Simple Placeholder for Dept Goals Summary */}
                            <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900">
                                <p className="text-sm text-muted-foreground">Overall Progress</p>
                                <div className="text-2xl font-bold mb-2">68%</div>
                                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[68%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="hiring" className="space-y-4">
                    <DeptHiringView vacancies={vacancies} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
