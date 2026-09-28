'use client'

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import { ChartData } from '@/types/dashboard'
import { ChartCard } from './ChartCard'
import { EmptyState } from './EmptyState'

interface PestleChartProps {
  data: ChartData[]
  loading?: boolean
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f97316', '#14b8a6']

export function PestleChart({ data, loading }: PestleChartProps) {
  if (loading) {
    return (
      <ChartCard title="PESTLE Distribution">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="PESTLE Distribution">
        <EmptyState />
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="PESTLE Distribution"
      description="Distribution across PESTLE categories"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
