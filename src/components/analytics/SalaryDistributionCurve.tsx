'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { generateBellCurveData } from '@/lib/stats';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SalaryDistributionCurve({ salaries }: { salaries: number[] }) {
    const data = useMemo(() => generateBellCurveData(salaries), [salaries]);
    const mean = useMemo(() => salaries.reduce((a, b) => a + b, 0) / (salaries.length || 1), [salaries]);

    if (!salaries.length) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Salary Distribution (Bell Curve)</CardTitle>
                <CardDescription>Pay equity and outlier detection</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="salary" tick={{ fontSize: 12 }} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                            <YAxis hide />
                            <Tooltip
                                formatter={(value: number) => ["", "Frequency Density"]}
                                labelFormatter={(label) => `Salary: GHS ${label}`}
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="frequency"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                            <ReferenceLine x={Math.round(mean)} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'Avg', fill: 'red', fontSize: 12 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
