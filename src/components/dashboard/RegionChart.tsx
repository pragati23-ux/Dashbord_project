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

interface RegionChartProps {
  data: ChartData[]
  loading?: boolean
}

const COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#f97316',
]

export function RegionChart({ data, loading }: RegionChartProps) {
  if (loading) {
    return (
      <ChartCard title="Geographic Distribution by Region">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Geographic Distribution by Region">
        <EmptyState />
      </ChartCard>
    )
  }

  // Limit to top 8 for pie chart readability
  const chartData = data.slice(0, 8)
  const other = data.slice(8)
  if (other.length > 0) {
    const otherSum = other.reduce((sum, item) => sum + item.value, 0)
    chartData.push({ name: 'Others', value: otherSum })
  }

  return (
    <ChartCard
      title="Geographic Distribution by Region"
      description="Distribution across regions"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
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
