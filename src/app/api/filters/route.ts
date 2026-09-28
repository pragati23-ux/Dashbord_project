import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Insight from '@/models/Insight'
import { FilterOptions } from '@/types/dashboard'

export async function GET() {
  try {
    await connectDB()

    // Get unique values for each categorical field
    const [topics, sectors, regions, countries, pestles, sources, years] = await Promise.all([
      Insight.distinct('topic', { topic: { $nin: [null, ''] } }),
      Insight.distinct('sector', { sector: { $nin: [null, ''] } }),
      Insight.distinct('region', { region: { $nin: [null, ''] } }),
      Insight.distinct('country', { country: { $nin: [null, ''] } }),
      Insight.distinct('pestle', { pestle: { $nin: [null, ''] } }),
      Insight.distinct('source', { source: { $nin: [null, ''] } }),
      Insight.distinct('end_year', { end_year: { $nin: [null, ''] } }),
    ])

    const filterOptions: FilterOptions = {
      topics: (topics as string[]).filter(Boolean).sort(),
      sectors: (sectors as string[]).filter(Boolean).sort(),
      regions: (regions as string[]).filter(Boolean).sort(),
      countries: (countries as string[]).filter(Boolean).sort(),
      pestles: (pestles as string[]).filter(Boolean).sort(),
      sources: (sources as string[]).filter(Boolean).sort((a, b) => a.localeCompare(b)).slice(0, 100),
      years: ((years as number[])
        .filter(y => y && !isNaN(y))
        .sort((a, b) => a - b)),
    }

    return NextResponse.json({
      success: true,
      data: filterOptions,
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
