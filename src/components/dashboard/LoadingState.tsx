export function LoadingState() {
  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            <div className="mt-4 h-8 w-32 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Chart Skeletons */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6">
            <div className="h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="mt-6 h-48 rounded bg-muted/50 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonLoader({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-12 rounded border border-border bg-muted animate-pulse" />
      ))}
    </div>
  )
}
