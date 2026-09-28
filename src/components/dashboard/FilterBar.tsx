'use client'

import { useCallback, useMemo } from 'react'
import { FilterOptions } from '@/types/dashboard'

interface FilterBarProps {
  filters: Record<string, any>
  onFilterChange: (key: string, value: any) => void
  onClearFilters: () => void
  filterOptions: FilterOptions | null
  isLoading?: boolean
}

export function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  filterOptions,
  isLoading = false,
}: FilterBarProps) {
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(
      (v) => v !== undefined && v !== null && v !== ''
    ).length
  }, [filters])

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = e.target
      onFilterChange(name, value === '' ? undefined : value)
    },
    [onFilterChange]
  )

  const handleNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      onFilterChange(name, value === '' ? undefined : parseInt(value))
    },
    [onFilterChange]
  )

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {activeFilterCount} active
            </span>
            <button
              onClick={onClearFilters}
              disabled={isLoading}
              className="rounded px-3 py-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Topic Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Topic
          </label>
          <select
            name="topic"
            value={filters.topic || ''}
            onChange={handleSelectChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All Topics</option>
            {filterOptions?.topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        {/* Sector Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Sector
          </label>
          <select
            name="sector"
            value={filters.sector || ''}
            onChange={handleSelectChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All Sectors</option>
            {filterOptions?.sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Region
          </label>
          <select
            name="region"
            value={filters.region || ''}
            onChange={handleSelectChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All Regions</option>
            {filterOptions?.regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* PESTLE Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            PESTLE
          </label>
          <select
            name="pestle"
            value={filters.pestle || ''}
            onChange={handleSelectChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All PESTLE</option>
            {filterOptions?.pestles.map((pestle) => (
              <option key={pestle} value={pestle}>
                {pestle}
              </option>
            ))}
          </select>
        </div>

        {/* End Year Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            End Year
          </label>
          <select
            name="endYear"
            value={filters.endYear || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All Years</option>
            {filterOptions?.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Country Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Country
          </label>
          <select
            name="country"
            value={filters.country || ''}
            onChange={handleSelectChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All Countries</option>
            {filterOptions?.countries.slice(0, 30).map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Source
          </label>
          <select
            name="source"
            value={filters.source || ''}
            onChange={handleSelectChange}
            disabled={isLoading}
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          >
            <option value="">All Sources</option>
            {filterOptions?.sources.slice(0, 30).map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </div>

        {/* Intensity Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Min Intensity
          </label>
          <input
            type="number"
            name="minIntensity"
            value={filters.minIntensity || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            min="1"
            max="96"
            placeholder="Min"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Intensity
          </label>
          <input
            type="number"
            name="maxIntensity"
            value={filters.maxIntensity || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            min="1"
            max="96"
            placeholder="Max"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Relevance Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Min Relevance
          </label>
          <input
            type="number"
            name="minRelevance"
            value={filters.minRelevance || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            min="1"
            max="7"
            placeholder="Min"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Relevance
          </label>
          <input
            type="number"
            name="maxRelevance"
            value={filters.maxRelevance || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            min="1"
            max="7"
            placeholder="Max"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Likelihood Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Min Likelihood
          </label>
          <input
            type="number"
            name="minLikelihood"
            value={filters.minLikelihood || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            min="1"
            max="4"
            placeholder="Min"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Max Likelihood
          </label>
          <input
            type="number"
            name="maxLikelihood"
            value={filters.maxLikelihood || ''}
            onChange={handleNumberChange}
            disabled={isLoading}
            min="1"
            max="4"
            placeholder="Max"
            className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  )
}
