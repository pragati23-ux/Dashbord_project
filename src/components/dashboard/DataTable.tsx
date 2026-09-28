'use client'

import { Insight } from '@/types/dashboard'
import { formatDate } from '@/lib/utils'
import { ChartCard } from './ChartCard'
import { EmptyState } from './EmptyState'
import { ExternalLink } from 'lucide-react'

interface DataTableProps {
  data: Insight[]
  loading?: boolean
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function DataTable({
  data,
  loading,
  page,
  total,
  limit,
  onPageChange,
}: DataTableProps) {
  if (loading) {
    return (
      <ChartCard title="Data Explorer">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 rounded bg-muted animate-pulse" />
          ))}
        </div>
      </ChartCard>
    )
  }

  if (!data || data.length === 0) {
    return (
      <ChartCard title="Data Explorer">
        <EmptyState />
      </ChartCard>
    )
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <ChartCard title="Data Explorer">
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Topic
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Sector
                </th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">
                  Region
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">
                  Intensity
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">
                  Relevance
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">
                  Likelihood
                </th>
                <th className="text-center py-3 px-4 font-semibold text-foreground">
                  Source
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((record) => (
                <tr
                  key={record._id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="truncate max-w-xs">
                      {record.url ? (
                        <a
                          href={record.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                          title={record.title}
                        >
                          <span className="truncate">{record.title}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                      ) : (
                        <span title={record.title} className="truncate">
                          {record.title}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {record.topic || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {record.sector || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {record.region || 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {record.intensity !== undefined ? record.intensity : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {record.relevance !== undefined ? record.relevance : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center font-medium">
                    {record.likelihood !== undefined ? record.likelihood : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-center text-muted-foreground text-xs max-w-xs truncate">
                    {record.source || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{' '}
            {total} records
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-border text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1
                if (totalPages > 5 && page > 3) {
                  pageNum = page - 2 + i
                }
                if (pageNum > totalPages) return null

                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      page === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded border border-border text-sm font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </ChartCard>
  )
}
