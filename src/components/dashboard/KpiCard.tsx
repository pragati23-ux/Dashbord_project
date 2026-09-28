import { formatNumber } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  format?: 'number' | 'text'
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export function KpiCard({
  title,
  value,
  icon,
  format = 'text',
  trend,
}: KpiCardProps) {
  const displayValue =
    format === 'number' && typeof value === 'number'
      ? formatNumber(Math.round(value * 100) / 100)
      : value

  return (
    <div className="rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {displayValue}
          </p>
          {trend && (
            <div className={`mt-2 text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
