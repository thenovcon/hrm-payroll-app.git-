'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F'];

export default function GrowthTrendChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) return null;

    // Extract department names from keys, excluding 'month'
    const departments = Object.keys(data[0]).filter(k => k !== 'month');

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Departmental Growth Velocity</CardTitle>
                <CardDescription>Headcount expansion by sector (12-Month View)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            {departments.map((dept, index) => (
                                <Area
                                    key={dept}
                                    type="monotone"
                                    dataKey={dept}
                                    stackId="1"
                                    stroke={COLORS[index % COLORS.length]}
                                    fill={COLORS[index % COLORS.length]}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
