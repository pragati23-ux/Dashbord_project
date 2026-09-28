'use client'

import { useEffect, useState, useCallback } from 'react'
import { Insight, FilterOptions, DashboardFilter, ChartData, KPIData } from '@/types/dashboard'
import { FilterBar } from './FilterBar'
import { KpiCard } from './KpiCard'
import { DataTable } from './DataTable'
import { IntensityChart } from './IntensityChart'
import { TopicChart } from './TopicChart'
import { SectorChart } from './SectorChart'
import { RegionChart } from './RegionChart'
import { CountryChart } from './CountryChart'
import { PestleChart } from './PestleChart'
import { RelevanceChart, LikelihoodChart } from './RelevanceChart'
import { LoadingState } from './LoadingState'
import { Zap, TrendingUp, Target, AlertCircle } from 'lucide-react'

interface DashboardResponse {
  success: boolean
  data: Insight[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  appliedFilters: Record<string, any>
}

interface AnalyticsResponse {
  success: boolean
  data: {
    kpi: KPIData
    byTopic: ChartData[]
    bySector: ChartData[]
    byRegion: ChartData[]
    byCountry: ChartData[]
    byPestle: ChartData[]
    intensityDistribution: ChartData[]
    relevanceDistribution: ChartData[]
    likelihoodDistribution: ChartData[]
    intensityVsRelevance: any[]
  }
}

export function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilter>({})
  const [records, setRecords] = useState<Insight[]>([])
  const [analytics, setAnalytics] = useState<AnalyticsResponse['data'] | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  // Fetch filter options
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const response = await fetch('/api/filters')
        if (!response.ok) throw new Error('Failed to fetch filters')
        const data = await response.json()
        setFilterOptions(data.data)
      } catch (err) {
        console.error('Error fetching filters:', err)
        setError('Failed to load filter options')
      }
    }
    fetchFilterOptions()
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        queryParams.set('page', page.toString())
        queryParams.set('limit', '50')

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.set(key, String(value))
          }
        })

        const response = await fetch(`/api/dashboard?${queryParams}`)
        if (!response.ok) throw new Error('Failed to fetch dashboard data')

        const data: DashboardResponse = await response.json()
        setRecords(data.data)
        setPagination({
          total: data.pagination.total,
          pages: data.pagination.pages,
        })
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [filters, page])

  // Fetch analytics data
  useEffect(() => {
    async function fetchAnalytics() {
      setAnalyticsLoading(true)
      try {
        const queryParams = new URLSearchParams()
        queryParams.set('type', 'all')

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.set(key, String(value))
          }
        })

        const response = await fetch(`/api/analytics?${queryParams}`)
        if (!response.ok) throw new Error('Failed to fetch analytics')

        const data: AnalyticsResponse = await response.json()
        setAnalytics(data.data)
      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setAnalyticsLoading(false)
      }
    }

    // Add a small delay to prevent too many requests
    const timeout = setTimeout(fetchAnalytics, 300)
    return () => clearTimeout(timeout)
  }, [filters])

  const handleFilterChange = useCallback((key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
    setPage(1)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setPage(1)
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Insights and trends analysis
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterOptions={filterOptions}
        isLoading={loading}
      />

      {/* KPI Cards */}
      {analyticsLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-lg border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : analytics ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Insights"
            value={analytics.kpi.totalInsights}
            icon={<Zap className="h-5 w-5 text-primary" />}
            format="number"
          />
          <KpiCard
            title="Avg Intensity"
            value={analytics.kpi.avgIntensity}
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            format="number"
          />
          <KpiCard
            title="Avg Relevance"
            value={analytics.kpi.avgRelevance}
            icon={<Target className="h-5 w-5 text-primary" />}
            format="number"
          />
          <KpiCard
            title="Unique Topics"
            value={analytics.kpi.uniqueTopics}
            icon={<AlertCircle className="h-5 w-5 text-primary" />}
            format="number"
          />
        </div>
      ) : null}

      {/* Charts Grid */}
      {analyticsLoading ? (
        <LoadingState />
      ) : analytics ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Row 1 */}
          <IntensityChart
            data={analytics.intensityDistribution || []}
            loading={analyticsLoading}
          />
          <RelevanceChart
            data={analytics.relevanceDistribution || []}
            loading={analyticsLoading}
          />

          {/* Row 2 */}
          <LikelihoodChart
            data={analytics.likelihoodDistribution || []}
            loading={analyticsLoading}
          />
          <PestleChart data={analytics.byPestle || []} loading={analyticsLoading} />

          {/* Row 3 */}
          <SectorChart data={analytics.bySector || []} loading={analyticsLoading} />
          <TopicChart data={analytics.byTopic || []} loading={analyticsLoading} />

          {/* Row 4 */}
          <RegionChart data={analytics.byRegion || []} loading={analyticsLoading} />
          <CountryChart data={analytics.byCountry || []} loading={analyticsLoading} />
        </div>
      ) : null}

      {/* Data Table */}
      <DataTable
        data={records}
        loading={loading}
        page={page}
        total={pagination.total}
        limit={50}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
