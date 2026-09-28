import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Insight from '@/models/Insight'
import { buildMongoFilter, normalizeInsight } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '50'))
    const skip = (page - 1) * limit

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

    // Get total count
    const totalCount = await Insight.countDocuments(mongoFilter)

    // Get paginated data
    const records = await Insight.find(mongoFilter)
      .skip(skip)
      .limit(limit)
      .lean()

    const normalizedRecords = records.map(normalizeInsight)

    return NextResponse.json({
      success: true,
      data: normalizedRecords,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      appliedFilters: filters,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    )
  }
}
