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

interface RelevanceChartProps {
  data: ChartData[]
  loading?: boolean
}

export function RelevanceChart({ data, loading }: RelevanceChartProps) {
  if (loading) {
    return (
      <ChartCard title="Relevance Distribution">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Relevance Distribution">
        <EmptyState />
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Relevance Distribution"
      description="Distribution of relevance levels (1-7)"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
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
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

interface LikelihoodChartProps {
  data: ChartData[]
  loading?: boolean
}

export function LikelihoodChart({ data, loading }: LikelihoodChartProps) {
  if (loading) {
    return (
      <ChartCard title="Likelihood Distribution">
        <div className="h-80 animate-pulse rounded bg-muted" />
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Likelihood Distribution">
        <EmptyState />
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Likelihood Distribution"
      description="Distribution of likelihood levels (1-4)"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
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
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
