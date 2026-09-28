import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Insight from '@/models/Insight'
import { buildMongoFilter, getAverage } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'all'

    // Build filter
    const filters: Record<string, any> = {}
    if (searchParams.get('topic')) filters.topic = searchParams.get('topic')
    if (searchParams.get('sector')) filters.sector = searchParams.get('sector')
    if (searchParams.get('region')) filters.region = searchParams.get('region')
    if (searchParams.get('country')) filters.country = searchParams.get('country')
    if (searchParams.get('pestle')) filters.pestle = searchParams.get('pestle')
    if (searchParams.get('source')) filters.source = searchParams.get('source')
    if (searchParams.get('endYear')) filters.endYear = parseInt(searchParams.get('endYear')!)
    if (searchParams.get('startYear')) filters.startYear = parseInt(searchParams.get('startYear')!)
    if (searchParams.get('minIntensity')) filters.minIntensity = parseInt(searchParams.get('minIntensity')!)
    if (searchParams.get('maxIntensity')) filters.maxIntensity = parseInt(searchParams.get('maxIntensity')!)
    if (searchParams.get('minRelevance')) filters.minRelevance = parseInt(searchParams.get('minRelevance')!)
    if (searchParams.get('maxRelevance')) filters.maxRelevance = parseInt(searchParams.get('maxRelevance')!)
    if (searchParams.get('minLikelihood')) filters.minLikelihood = parseInt(searchParams.get('minLikelihood')!)
    if (searchParams.get('maxLikelihood')) filters.maxLikelihood = parseInt(searchParams.get('maxLikelihood')!)
    if (searchParams.get('search')) filters.search = searchParams.get('search')

    const mongoFilter = buildMongoFilter(filters)

    let analytics: any = {}

    // Get KPI data
    const allRecords = await Insight.find(mongoFilter).lean()

    analytics.kpi = {
      totalInsights: allRecords.length,
      avgIntensity: getAverage(allRecords.map((r: any) => r.intensity)),
      avgRelevance: getAverage(allRecords.map((r: any) => r.relevance)),
      avgLikelihood: getAverage(allRecords.map((r: any) => r.likelihood)),
      uniqueTopics: new Set(allRecords.map((r: any) => r.topic).filter(Boolean)).size,
      uniqueSectors: new Set(allRecords.map((r: any) => r.sector).filter(Boolean)).size,
      uniqueCountries: new Set(allRecords.map((r: any) => r.country).filter(Boolean)).size,
    }

    // Group by various fields
    if (type === 'all' || type === 'topic') {
      const topicGroups: Record<string, any> = {}
      allRecords.forEach((record: any) => {
        const topic = record.topic || 'Unspecified'
        if (!topicGroups[topic]) {
          topicGroups[topic] = { count: 0, intensity: [], relevance: [], likelihood: [] }
        }
        topicGroups[topic].count++
        if (record.intensity) topicGroups[topic].intensity.push(record.intensity)
        if (record.relevance) topicGroups[topic].relevance.push(record.relevance)
        if (record.likelihood) topicGroups[topic].likelihood.push(record.likelihood)
      })

      analytics.byTopic = Object.entries(topicGroups)
        .map(([topic, data]: [string, any]) => ({
          name: topic,
          value: data.count,
          avgIntensity: data.intensity.length > 0 ? data.intensity.reduce((a: number, b: number) => a + b) / data.intensity.length : 0,
          avgRelevance: data.relevance.length > 0 ? data.relevance.reduce((a: number, b: number) => a + b) / data.relevance.length : 0,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 20)
    }

    if (type === 'all' || type === 'sector') {
      const sectorGroups: Record<string, any> = {}
      allRecords.forEach((record: any) => {
        const sector = record.sector || 'Unspecified'
        if (!sectorGroups[sector]) {
          sectorGroups[sector] = { count: 0, intensity: [] }
        }
        sectorGroups[sector].count++
        if (record.intensity) sectorGroups[sector].intensity.push(record.intensity)
      })

      analytics.bySector = Object.entries(sectorGroups)
        .map(([sector, data]: [string, any]) => ({
          name: sector,
          value: data.count,
          avgIntensity: data.intensity.length > 0 ? data.intensity.reduce((a: number, b: number) => a + b) / data.intensity.length : 0,
        }))
        .sort((a, b) => b.value - a.value)
    }

    if (type === 'all' || type === 'region') {
      const regionGroups: Record<string, any> = {}
      allRecords.forEach((record: any) => {
        const region = record.region || 'Unspecified'
        if (!regionGroups[region]) {
          regionGroups[region] = { count: 0 }
        }
        regionGroups[region].count++
      })

      analytics.byRegion = Object.entries(regionGroups)
        .map(([region, data]: [string, any]) => ({
          name: region,
          value: data.count,
        }))
        .sort((a, b) => b.value - a.value)
    }

    if (type === 'all' || type === 'country') {
      const countryGroups: Record<string, any> = {}
      allRecords.forEach((record: any) => {
        const country = record.country || 'Unspecified'
        if (!countryGroups[country]) {
          countryGroups[country] = { count: 0 }
        }
        countryGroups[country].count++
      })

      analytics.byCountry = Object.entries(countryGroups)
        .map(([country, data]: [string, any]) => ({
          name: country,
          value: data.count,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 15)
    }

    if (type === 'all' || type === 'pestle') {
      const pestleGroups: Record<string, any> = {}
      allRecords.forEach((record: any) => {
        const pestle = record.pestle || 'Unspecified'
        if (!pestleGroups[pestle]) {
          pestleGroups[pestle] = { count: 0 }
        }
        pestleGroups[pestle].count++
      })

      analytics.byPestle = Object.entries(pestleGroups)
        .map(([pestle, data]: [string, any]) => ({
          name: pestle,
          value: data.count,
        }))
        .sort((a, b) => b.value - a.value)
    }

    if (type === 'all' || type === 'intensity') {
      const intensityBins: Record<number, number> = {}
      allRecords.forEach((record: any) => {
        if (record.intensity) {
          const bin = Math.floor(record.intensity / 5) * 5
          intensityBins[bin] = (intensityBins[bin] || 0) + 1
        }
      })

      analytics.intensityDistribution = Object.entries(intensityBins)
        .map(([bin, count]) => ({
          range: `${bin}-${parseInt(bin) + 5}`,
          value: count,
        }))
        .sort((a, b) => parseInt(a.range) - parseInt(b.range))
    }

    if (type === 'all' || type === 'relevance') {
      const relevanceCounts: Record<number, number> = {}
      allRecords.forEach((record: any) => {
        if (record.relevance) {
          relevanceCounts[record.relevance] = (relevanceCounts[record.relevance] || 0) + 1
        }
      })

      analytics.relevanceDistribution = Object.entries(relevanceCounts)
        .map(([level, count]) => ({
          name: `Level ${level}`,
          value: count,
        }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name))
    }

    if (type === 'all' || type === 'likelihood') {
      const likelihoodCounts: Record<number, number> = {}
      allRecords.forEach((record: any) => {
        if (record.likelihood) {
          likelihoodCounts[record.likelihood] = (likelihoodCounts[record.likelihood] || 0) + 1
        }
      })

      analytics.likelihoodDistribution = Object.entries(likelihoodCounts)
        .map(([level, count]) => ({
          name: `Level ${level}`,
          value: count,
        }))
        .sort((a, b) => parseInt(a.name) - parseInt(b.name))
    }

    // Scatter plot: intensity vs relevance
    if (type === 'all' || type === 'scatter') {
      analytics.intensityVsRelevance = allRecords
        .filter((r: any) => r.intensity && r.relevance)
        .slice(0, 300) // Limit for performance
        .map((r: any) => ({
          x: r.relevance,
          y: r.intensity,
          topic: r.topic || 'Unspecified',
        }))
    }

    return NextResponse.json({
      success: true,
      data: analytics,
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}
