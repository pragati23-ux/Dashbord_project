import { Insight, ChartData } from '@/types/dashboard'

/**
 * Safely get a numeric value, handling null/undefined/empty strings
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === '') {
    return defaultValue
  }
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * Safely get a string value, handling null/undefined
 */
export function safeString(value: any, defaultValue: string = 'N/A'): string {
  if (value === null || value === undefined || value === '') {
    return defaultValue
  }
  return String(value).trim()
}

/**
 * Check if a value is empty/null/undefined
 */
export function isEmpty(value: any): boolean {
  return value === null || value === undefined || value === ''
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format a date string
 */
export function formatDate(dateString: string): string {
  if (!dateString || dateString.trim() === '') {
    return 'N/A'
  }
  try {
    return new Date(dateString).toLocaleDateString('en-US')
  } catch {
    return safeString(dateString)
  }
}

/**
 * Extract year from a date string
 */
export function extractYear(dateString: string): number {
  if (!dateString || dateString.trim() === '') {
    return new Date().getFullYear()
  }
  try {
    return new Date(dateString).getFullYear()
  } catch {
    return new Date().getFullYear()
  }
}

/**
 * Normalize Insight data
 */
export function normalizeInsight(data: any): Insight {
  return {
    _id: data._id?.toString() || '',
    end_year: isEmpty(data.end_year) ? undefined : safeNumber(data.end_year),
    intensity: isEmpty(data.intensity) ? undefined : safeNumber(data.intensity),
    sector: isEmpty(data.sector) ? undefined : safeString(data.sector),
    topic: isEmpty(data.topic) ? undefined : safeString(data.topic),
    insight: safeString(data.insight),
    url: safeString(data.url),
    region: isEmpty(data.region) ? undefined : safeString(data.region),
    start_year: isEmpty(data.start_year) ? undefined : safeNumber(data.start_year),
    impact: isEmpty(data.impact) ? undefined : safeNumber(data.impact),
    added: safeString(data.added),
    published: isEmpty(data.published) ? undefined : safeString(data.published),
    country: isEmpty(data.country) ? undefined : safeString(data.country),
    relevance: isEmpty(data.relevance) ? undefined : safeNumber(data.relevance),
    pestle: isEmpty(data.pestle) ? undefined : safeString(data.pestle),
    source: isEmpty(data.source) ? undefined : safeString(data.source),
    title: safeString(data.title),
    likelihood: isEmpty(data.likelihood) ? undefined : safeNumber(data.likelihood),
  }
}

/**
 * Get average value from array
 */
export function getAverage(values: (number | undefined)[]): number {
  const validValues = values.filter((v): v is number => v !== undefined && v !== null)
  if (validValues.length === 0) return 0
  return validValues.reduce((a, b) => a + b, 0) / validValues.length
}

/**
 * Group array of objects by a key
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key] || 'N/A')
      if (!result[groupKey]) {
        result[groupKey] = []
      }
      result[groupKey].push(item)
      return result
    },
    {} as Record<string, T[]>
  )
}

/**
 * Count occurrences in array
 */
export function countOccurrences<T>(array: T[]): Record<string, number> {
  return array.reduce(
    (result, item) => {
      const key = String(item || 'N/A')
      result[key] = (result[key] || 0) + 1
      return result
    },
    {} as Record<string, number>
  )
}

/**
 * Sort object entries by count (descending)
 */
export function sortByCount(obj: Record<string, number>): Array<[string, number]> {
  return Object.entries(obj).sort((a, b) => b[1] - a[1])
}

/**
 * Get top N items
 */
export function getTop<T>(array: T[], n: number = 10): T[] {
  return array.slice(0, n)
}

/**
 * Convert record count object to chart data
 */
export function toChartData(obj: Record<string, number>, label: string = 'count'): ChartData[] {
  return Object.entries(obj).map(([key, value]) => ({
    name: key,
    value,
    count: value,
  }))
}

/**
 * Build MongoDB filter query from dashboard filters
 */
export function buildMongoFilter(filters: Record<string, any>): Record<string, any> {
  const mongoFilter: Record<string, any> = {}

  if (filters.topic && filters.topic !== '') {
    mongoFilter.topic = filters.topic
  }

  if (filters.sector && filters.sector !== '') {
    mongoFilter.sector = filters.sector
  }

  if (filters.region && filters.region !== '') {
    mongoFilter.region = filters.region
  }

  if (filters.country && filters.country !== '') {
    mongoFilter.country = filters.country
  }

  if (filters.pestle && filters.pestle !== '') {
    mongoFilter.pestle = filters.pestle
  }

  if (filters.source && filters.source !== '') {
    mongoFilter.source = filters.source
  }

  if (filters.endYear && filters.endYear > 0) {
    mongoFilter.end_year = filters.endYear
  }

  if (filters.startYear && filters.startYear > 0) {
    mongoFilter.start_year = filters.startYear
  }

  // Range filters
  if (filters.minIntensity !== undefined || filters.maxIntensity !== undefined) {
    mongoFilter.intensity = {}
    if (filters.minIntensity !== undefined) {
      mongoFilter.intensity.$gte = filters.minIntensity
    }
    if (filters.maxIntensity !== undefined) {
      mongoFilter.intensity.$lte = filters.maxIntensity
    }
  }

  if (filters.minRelevance !== undefined || filters.maxRelevance !== undefined) {
    mongoFilter.relevance = {}
    if (filters.minRelevance !== undefined) {
      mongoFilter.relevance.$gte = filters.minRelevance
    }
    if (filters.maxRelevance !== undefined) {
      mongoFilter.relevance.$lte = filters.maxRelevance
    }
  }

  if (filters.minLikelihood !== undefined || filters.maxLikelihood !== undefined) {
    mongoFilter.likelihood = {}
    if (filters.minLikelihood !== undefined) {
      mongoFilter.likelihood.$gte = filters.minLikelihood
    }
    if (filters.maxLikelihood !== undefined) {
      mongoFilter.likelihood.$lte = filters.maxLikelihood
    }
  }

  // Text search
  if (filters.search && filters.search.trim() !== '') {
    mongoFilter.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { insight: { $regex: filters.search, $options: 'i' } },
    ]
  }

  return mongoFilter
}
