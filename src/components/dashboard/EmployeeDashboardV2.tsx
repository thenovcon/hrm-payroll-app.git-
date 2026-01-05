'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Briefcase, GraduationCap, Clock, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function EmployeeDashboardV2({ employee, stats, attendance, skills }: any) {
    // Mock Data for Visuals until real data pipes are fully robust

    // 1. Leave Circular Progress
    const leaveData = [
        { name: 'Used', value: 15 - (stats?.leaveBalance || 15) },
        { name: 'Remaining', value: stats?.leaveBalance || 15 },
    ];
    const COLORS = ['#e2e8f0', '#3b82f6']; // Slate-200, Blue-500

    // 2. Attendance Heatmap Data (Simulated for this month)
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const heatmap = Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        // Mock logic: Weekends off, some random absences
        const date = new Date();
        date.setDate(day);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        let status = 'PRESENT';
        if (isWeekend) status = 'WEEKEND';
        else if (Math.random() > 0.9) status = 'LATE';
        else if (Math.random() > 0.95) status = 'ABSENT';
        return { day, status };
    });

    // 3. Career Path Matches (Mock Internal Vacancies)
    const vacancies = [
        { title: 'Senior Developer', team: 'Engineering', match: '95%', reason: 'Matches your "React" & "Node.js" skills' },
        { title: 'Tech Lead', team: 'Platform', match: '80%', reason: 'Requires "Leadership" skill' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Welcome, {employee?.firstName}</h2>
                    <p className="text-slate-500">Here's your personal growth & activity overview.</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-700">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* 1. Leave Balance (Circular) */}
                <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-blue-500" />
                            My Leave
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="relative w-24 h-24">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={leaveData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={35}
                                        outerRadius={45}
                                        paddingAngle={5}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {leaveData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-lg font-bold text-slate-700">{stats?.leaveBalance}</span>
                                <span className="text-[9px] text-slate-400 uppercase">Days Left</span>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                                {leaveData[0].value} Used
                            </div>
                            <p className="text-xs text-slate-400">Total: 15 Days</p>
                            <button className="text-xs text-blue-600 font-medium hover:underline flex items-center justify-end gap-1 mt-2">
                                Request Leave <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Attendance Heatmap (Quick View) */}
                <Card className="shadow-sm border-slate-200 md:col-span-2">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-500" />
                            Attendance This Month
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                            {heatmap.map((d) => (
                                <div
                                    key={d.day}
                                    title={`Day ${d.day}: ${d.status}`}
                                    className={`w-7 h-7 rounded text-[10px] flex items-center justify-center font-medium
                                        ${d.status === 'WEEKEND' ? 'bg-slate-50 text-slate-300' :
                                            d.status === 'PRESENT' ? 'bg-green-500 text-white' :
                                                d.status === 'LATE' ? 'bg-amber-400 text-white' :
                                                    'bg-red-400 text-white'}
                                    `}
                                >
                                    {d.day}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4 text-xs text-slate-400 justify-center md:justify-start">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500"></span> Present</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400"></span> Late</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-400"></span> Absent</span>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Career Pathing */}
                <Card className="shadow-sm border-slate-200 md:col-span-3">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-emerald-500" />
                            Internal Opportunities (Career Path)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vacancies.map((job, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-lg p-3 flex w-full justify-between items-center hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-700 text-sm group-hover:text-emerald-700 transition-colors">{job.title}</h4>
                                            <p className="text-xs text-slate-500">{job.team} • <span className="text-emerald-600 font-medium">{job.match} Skill Match</span></p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 bg-blue-50 rounded-lg p-3 flex items-start gap-3">
                            <GraduationCap className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h5 className="text-sm font-semibold text-blue-800">Grow your skills</h5>
                                <p className="text-xs text-blue-600 mt-1">Based on your goals, we recommend taking "Advanced Project Management" to increase your match for leadership roles.</p>
                                <button className="text-xs font-bold text-blue-700 mt-2 hover:underline">View Training Catalog</button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
