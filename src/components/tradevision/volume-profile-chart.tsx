
'use client';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VolumeProfileChartProps {
    data: { time: string; volume: number }[];
}

export function VolumeProfileChart({ data }: VolumeProfileChartProps) {
  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.sky-400/0.5)]">
        <CardHeader>
            <CardTitle>Volume Profile (24h)</CardTitle>
            <CardDescription>Volume traded at different times of the day.</CardDescription>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                    <XAxis
                        dataKey="time"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value as number / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)",
                        }}
                    />
                    <Bar dataKey="volume" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
}
