'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartData } from '@/types/dashboard'
import { ChartCard } from './ChartCard'
import { EmptyState } from './EmptyState'

interface IntensityChartProps {
  data: ChartData[]
  loading?: boolean
}

export function IntensityChart({ data, loading }: IntensityChartProps) {
  if (loading) {
    return (
      <ChartCard title="Intensity Distribution">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Intensity Distribution">
        <EmptyState />
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Intensity Distribution"
      description="Distribution of intensity levels across records"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="range"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
            }}
            formatter={(value: any) => value}
          />
          <Bar
            dataKey="value"
            fill="hsl(212.7 26.8% 83.9%)"
            name="Count"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
