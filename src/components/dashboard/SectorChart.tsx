'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ChartData } from '@/types/dashboard'
import { ChartCard } from './ChartCard'
import { EmptyState } from './EmptyState'

interface SectorChartProps {
  data: ChartData[]
  loading?: boolean
}

export function SectorChart({ data, loading }: SectorChartProps) {
  if (loading) {
    return (
      <ChartCard title="Records by Sector">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Records by Sector">
        <EmptyState />
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Records by Sector"
      description="Distribution across sectors"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11 }}
            width={95}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Bar
            dataKey="value"
            fill="hsl(212.7 26.8% 83.9%)"
            name="Count"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
