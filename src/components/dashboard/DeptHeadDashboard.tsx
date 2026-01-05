'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DeptHeadDashboardProps {
    stats: {
        total: number;
        active: number;
        onLeave: number;
    };
    pendingLeaves: any[];
}

export default function DeptHeadDashboard({ stats, pendingLeaves }: DeptHeadDashboardProps) {
    // Overlap Logic: Check if > 20% of team is on leave
    const isOnLeaveHigh = (stats.onLeave / stats.total) > 0.2;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Team Size</CardTitle>
                        <span className="text-2xl">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.total}</div>
                        <p className="text-xs text-muted-foreground">{stats.active} Active Now</p>
                    </CardContent>
                </Card>

                <Card className={isOnLeaveHigh ? "bg-red-50 border-red-200" : "bg-gradient-to-br from-green-50 to-green-100 dark:from-slate-900 dark:to-slate-800 border-none shadow-md"}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">On Leave</CardTitle>
                        <span className="text-2xl">🏖️</span>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${isOnLeaveHigh ? "text-red-600" : "text-green-700 dark:text-green-400"}`}>
                            {stats.onLeave}
                        </div>
                        {isOnLeaveHigh && (
                            <Badge variant="destructive" className="mt-2 animate-pulse">
                                High Absence Alert
                            </Badge>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <span className="text-2xl">📝</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                            {pendingLeaves.length}
                        </div>
                        <p className="text-xs text-muted-foreground">Leave Requests</p>
                    </CardContent>
                </Card>
            </div>

            {/* Attendance Heatmap Mock */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Presence Heatmap (Today)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2 flex-wrap">
                        {Array.from({ length: 30 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-8 h-8 rounded-sm ${i < stats.active ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                title={i < stats.active ? 'Present' : 'Absent/Leave'}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
