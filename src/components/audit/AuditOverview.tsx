'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AuditOverview({ data }: { data: any[] }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Month Cost</CardTitle>
                        <span className="text-muted-foreground">💰</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₵{data[data.length - 1]?.totalCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">+2.5% from previous month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Headcount Variance</CardTitle>
                        <span className="text-muted-foreground">👥</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">No change</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Audits</CardTitle>
                        <span className="text-muted-foreground">⚠️</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1</div>
                        <p className="text-xs text-muted-foreground">Requires review</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payroll Variance (6 Month Trend)</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(val) => `₵${val / 1000}k`} />
                            <Tooltip formatter={(val: number) => `₵${val.toLocaleString()}`} />
                            <Area type="monotone" dataKey="totalCost" stackId="1" stroke="#0f172a" fill="#3b82f6" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="netPay" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
