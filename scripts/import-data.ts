import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Insight from '../src/models/Insight'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI

async function importData() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set')
    }

    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('✓ Connected to MongoDB')

    // Read JSON file
    const dataPath = path.join(__dirname, '../jsondata.json')
    console.log(`Reading data from ${dataPath}...`)

    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`)
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8')
    const records = JSON.parse(rawData)

    if (!Array.isArray(records)) {
      throw new Error('JSON data should be an array of records')
    }

    console.log(`Found ${records.length} records to import`)

    // Clear existing data
    console.log('Clearing existing data...')
    await Insight.deleteMany({})
    console.log('✓ Cleared existing data')

    // Validate and normalize records
    const validRecords = records
      .map((record, index) => {
        try {
          return {
            end_year: record.end_year ? parseInt(record.end_year) : undefined,
            intensity: record.intensity ? parseInt(record.intensity) : undefined,
            sector: record.sector && record.sector.trim() ? record.sector.trim() : undefined,
            topic: record.topic && record.topic.trim() ? record.topic.trim() : undefined,
            insight: record.insight && record.insight.trim() ? record.insight.trim() : 'Unknown',
            url: record.url || '',
            region: record.region && record.region.trim() ? record.region.trim() : undefined,
            start_year: record.start_year ? parseInt(record.start_year) : undefined,
            impact: record.impact ? parseInt(record.impact) : undefined,
            added: record.added || new Date().toISOString(),
            published: record.published && record.published.trim() ? record.published.trim() : undefined,
            country: record.country && record.country.trim() ? record.country.trim() : undefined,
            relevance: record.relevance ? parseInt(record.relevance) : undefined,
            pestle: record.pestle && record.pestle.trim() ? record.pestle.trim() : undefined,
            source: record.source && record.source.trim() ? record.source.trim() : undefined,
            title: record.title && record.title.trim() ? record.title.trim() : 'Unknown',
            likelihood: record.likelihood ? parseInt(record.likelihood) : undefined,
          }
        } catch (error) {
          console.warn(`Warning: Failed to process record ${index}:`, error)
          return null
        }
      })
      .filter((record): record is any => record !== null)

    console.log(
      `Validated ${validRecords.length}/${records.length} records (${(validRecords.length / records.length * 100).toFixed(1)}%)`
    )

    // Insert in batches to avoid memory issues
    const batchSize = 500
    let insertedCount = 0

    for (let i = 0; i < validRecords.length; i += batchSize) {
      const batch = validRecords.slice(i, i + batchSize)
      await Insight.insertMany(batch)
      insertedCount += batch.length
      console.log(`Inserted ${insertedCount}/${validRecords.length} records`)
    }

    // Log statistics
    const totalCount = await Insight.countDocuments()
    const intensityCount = await Insight.countDocuments({ intensity: { $ne: null } })
    const relevanceCount = await Insight.countDocuments({ relevance: { $ne: null } })
    const likelihoodCount = await Insight.countDocuments({ likelihood: { $ne: null } })
    const topicCount = await Insight.countDocuments({ topic: { $ne: null } })
    const sectorCount = await Insight.countDocuments({ sector: { $ne: null } })
    const regionCount = await Insight.countDocuments({ region: { $ne: null } })
    const countryCount = await Insight.countDocuments({ country: { $ne: null } })

    console.log('\n=== Import Complete ===')
    console.log(`Total records: ${totalCount}`)
    console.log(`Records with intensity: ${intensityCount}`)
    console.log(`Records with relevance: ${relevanceCount}`)
    console.log(`Records with likelihood: ${likelihoodCount}`)
    console.log(`Records with topic: ${topicCount}`)
    console.log(`Records with sector: ${sectorCount}`)
    console.log(`Records with region: ${regionCount}`)
    console.log(`Records with country: ${countryCount}`)

    await mongoose.disconnect()
    console.log('✓ Disconnected from MongoDB')
    process.exit(0)
  } catch (error) {
    console.error('Import failed:', error)
    process.exit(1)
  }
}

importData()
