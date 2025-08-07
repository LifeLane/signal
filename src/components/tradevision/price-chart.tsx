
'use client';
import { Bar, BarChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { PriceHistoryPoint } from '@/services/market-data';

interface PriceChartProps {
    data: PriceHistoryPoint[];
}

const chartConfig = {
    price: {
        label: 'Price',
    },
    line: {
        color: 'hsl(var(--primary))'
    },
    candle: {
        color: 'hsl(var(--primary))'
    }
};

const CustomCandle = (props: any) => {
    const { x, y, width, height, low, high, open, close, fill } = props;
    const isBullish = close > open;
    const bodyColor = isBullish ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-5))';

    return (
        <g>
            <path
                d={`M ${x + width / 2},${y + height - (high - Math.max(open, close))} L ${x + width / 2},${y + height}`}
                stroke={bodyColor}
                strokeWidth={1}
            />
             <path
                d={`M ${x + width / 2},${y} L ${x + width / 2},${y + (Math.min(open, close) - low)}`}
                stroke={bodyColor}
                strokeWidth={1}
            />
            <rect
                x={x}
                y={y + height - (Math.max(open, close) - Math.min(open, close))}
                width={width}
                height={Math.abs(open - close)}
                fill={bodyColor}
            />
        </g>
    );
}


export function PriceChart({ data }: PriceChartProps) {
  const yDomain = [
    Math.min(...data.map(p => p.low)) * 0.98,
    Math.max(...data.map(p => p.high)) * 1.02
  ];

  return (
    <Card className="bg-card animate-pulse-glow [--glow-color:theme(colors.sky-400/0.5)]">
        <CardHeader>
            <CardTitle>Price Chart (30d)</CardTitle>
            <CardDescription>30-day price history for the selected asset.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis 
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value, index) => {
                                return index % 5 === 0 ? value : '';
                            }}
                         />
                        <YAxis 
                            domain={yDomain}
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `$${(value as number).toFixed(0)}`}
                        />
                        <Tooltip 
                            cursor={{strokeDasharray: '3 3'}}
                            content={<ChartTooltipContent
                                formatter={(value: any, name: any, props: any) => {
                                    const { open, high, low, close } = props.payload;
                                    return (
                                        <div className='flex flex-col text-xs'>
                                           <div><span className='font-bold'>O:</span> {open.toFixed(2)}</div>
                                           <div><span className='font-bold'>H:</span> {high.toFixed(2)}</div>
                                           <div><span className='font-bold'>L:</span> {low.toFixed(2)}</div>
                                           <div><span className='font-bold'>C:</span> {close.toFixed(2)}</div>
                                        </div>
                                    )
                                }}
                            />}
                        />
                        <Bar
                            dataKey="close"
                            shape={<CustomCandle />}
                        />
                        <Line type="monotone" dataKey="close" stroke="hsl(var(--primary) / 0.5)" strokeWidth={2} dot={false} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
  );
}
