'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface FunnelData {
    stage: string;
    count: number;
}

interface RecruitmentFunnelChartProps {
    data: FunnelData[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#10b981', '#64748b'];

export default function RecruitmentFunnelChart({ data }: RecruitmentFunnelChartProps) {
    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis
                        dataKey="stage"
                        type="category"
                        width={100}
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
