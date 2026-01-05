'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { useEffect, useState } from "react";
import { getHeadcountByDept, getSalaryDistribution, getPayrollTrends, getDemographics } from "@/lib/actions/analytics-actions";
import { Loader2, TrendingUp, Users, DollarSign, Activity } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ExecutiveDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>({
        headcount: [],
        salaryDist: [],
        payrollTrend: [],
        gender: []
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [headcount, salaryDist, payrollTrend, gender] = await Promise.all([
                    getHeadcountByDept(),
                    getSalaryDistribution(),
                    getPayrollTrends(),
                    getDemographics()
                ]);
                setData({ headcount, salaryDist, payrollTrend, gender });
            } catch (error) {
                console.error("Failed to load dashboards", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    const totalStaff = data.headcount.reduce((acc: number, curr: any) => acc + curr.value, 0);
    const totalPayroll = data.payrollTrend.length > 0 ? data.payrollTrend[data.payrollTrend.length - 1].Cost : 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium opacity-90">Total Workforce</CardTitle>
                        <Users className="h-4 w-4 opacity-75" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStaff.toLocaleString()}</div>
                        <p className="text-xs opacity-75 mt-1">Active Employees</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payroll</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₵{totalPayroll.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Last Run Cost</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.headcount.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Operational Units</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Salary</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₵{data.salaryDist.length > 0 ? '---' : 'N/A'}</div>
                        <p className="text-xs text-muted-foreground mt-1">Median Estimate</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                {/* Payroll Trend - Large */}
                <Card className="col-span-4 border-l-4 border-emerald-500">
                    <CardHeader>
                        <CardTitle>Payroll Cost Analysis</CardTitle>
                        <CardDescription>6-Month Spending Trend</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.payrollTrend}>
                                    <defs>
                                        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₵${value / 1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <Tooltip
                                        formatter={(value: number) => [`₵${value.toLocaleString()}`, 'Total Cost']}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    />
                                    <Area type="monotone" dataKey="Cost" stroke="#10b981" fillOpacity={1} fill="url(#colorCost)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Headcount Distribution - Side */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Workforce by Department</CardTitle>
                        <CardDescription>Distribution across units</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.headcount}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.headcount.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Salary Histogram */}
                <Card>
                    <CardHeader>
                        <CardTitle>Salary Distribution Curve</CardTitle>
                        <CardDescription>Frequency of salary ranges</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.salaryDist}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="range" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                                    />
                                    <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Gender Demographics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gender Balance</CardTitle>
                        <CardDescription>Diversity Metric</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full flex items-center justify-center">
                            {data.gender.map((g: any, i: number) => (
                                <div key={i} className="flex flex-col items-center mx-4">
                                    <div className={`text-4xl font-bold ${g.name === 'MALE' ? 'text-blue-500' : 'text-pink-500'}`}>
                                        {((g.value / totalStaff) * 100).toFixed(1)}%
                                    </div>
                                    <div className="text-sm text-muted-foreground uppercase mt-2">{g.name}</div>
                                    <div className="text-xs opacity-50">({g.value} Staff)</div>
                                </div>
                            ))}
                            {data.gender.length === 0 && <span className="text-muted-foreground">No data available</span>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
