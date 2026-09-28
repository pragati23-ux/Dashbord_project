# BlackCoffer Analytics Dashboard

A production-ready, interactive data visualization dashboard built with Next.js, React, TypeScript, and Tailwind CSS. The dashboard visualizes 1,000+ records of insight data with advanced filtering and analytics capabilities.

## Features

- **Interactive Visualizations**: 8+ charts including bar charts, pie charts, and distributions
- **Real-time Filtering**: Filter data by topic, sector, region, PESTLE, source, country, intensity, relevance, and likelihood
- **KPI Metrics**: Track total insights, average intensity, relevance, and more
- **Data Explorer**: Paginated table view with sortable columns and clickable source links
- **MongoDB Integration**: All data stored and queried from MongoDB
- **Responsive Design**: Fully responsive on desktop, tablet, and mobile
- **Type-Safe**: Built with TypeScript for type safety and better developer experience
- **Performance Optimized**: Server-side rendering, efficient queries, and pagination

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts (interactive, responsive charts)
- **Backend**: Next.js API Routes
- **Database**: MongoDB + Mongoose ORM
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ or Node.js 20+
- MongoDB (local installation or MongoDB Atlas cloud account)
- npm or yarn

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

**Option A: Using MongoDB Atlas (Recommended for production)**

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with a strong password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/blackcoffer?retryWrites=true&w=majority`)

**Option B: Using Local MongoDB**

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start the MongoDB service
3. Connection string: `mongodb://localhost:27017/blackcoffer`

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blackcoffer?retryWrites=true&w=majority
NODE_ENV=development
```

### 4. Import Data

Run the data import script to populate MongoDB with the provided `jsondata.json`:

```bash
npm run import-data
```

This will:
- Connect to MongoDB
- Clear existing data
- Validate and normalize 1,000 records
- Insert all records into the `insights` collection
- Display import statistics

You should see output like:
```
Connected to MongoDB
Reading data from jsondata.json...
Found 1000 records to import
Validating 1000 records...
Validated 1000/1000 records (100.0%)
Inserting...
Total records: 1000
Records with intensity: 962
Records with relevance: 999
...
```

## Running the Application

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The dashboard will automatically redirect to `/dashboard`.

### Production Build

```bash
npm run build
npm start
```

### Linting and Type Checking

```bash
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analytics/route.ts      # Analytics aggregation API
│   │   ├── dashboard/route.ts      # Dashboard data API
│   │   └── filters/route.ts        # Filter options API
│   ├── dashboard/
│   │   └── page.tsx                # Dashboard page
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home (redirects to dashboard)
├── components/
│   └── dashboard/
│       ├── ChartCard.tsx           # Chart wrapper component
│       ├── CountryChart.tsx        # Country distribution chart
│       ├── Dashboard.tsx           # Main dashboard component
│       ├── DataTable.tsx           # Data explorer table
│       ├── EmptyState.tsx          # Empty state UI
│       ├── FilterBar.tsx           # Filter controls
│       ├── IntensityChart.tsx      # Intensity distribution chart
│       ├── KpiCard.tsx             # KPI metric card
│       ├── LikelihoodChart.tsx     # Likelihood chart
│       ├── LoadingState.tsx        # Loading skeletons
│       ├── PestleChart.tsx         # PESTLE distribution
│       ├── RelevanceChart.tsx      # Relevance chart
│       ├── RegionChart.tsx         # Region distribution
│       ├── SectorChart.tsx         # Sector chart
│       └── TopicChart.tsx          # Topic chart
├── lib/
│   ├── mongodb.ts                  # MongoDB connection utility
│   └── utils.ts                    # Utility functions
├── models/
│   └── Insight.ts                  # Mongoose schema
├── types/
│   └── dashboard.ts                # TypeScript definitions
└── scripts/
    └── import-data.ts              # Data import script
```

## API Endpoints

### GET /api/dashboard

Retrieves paginated insight records with optional filtering.

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 50) - Records per page (max: 100)
- `topic` - Filter by topic
- `sector` - Filter by sector
- `region` - Filter by region
- `country` - Filter by country
- `pestle` - Filter by PESTLE category
- `source` - Filter by source
- `endYear` - Filter by end year
- `minIntensity`, `maxIntensity` - Intensity range
- `minRelevance`, `maxRelevance` - Relevance range
- `minLikelihood`, `maxLikelihood` - Likelihood range
- `search` - Text search in title/insight

**Example:**
```bash
GET /api/dashboard?sector=Energy&minIntensity=50&page=1&limit=20
```

### GET /api/filters

Returns available filter options from the database.

**Response:**
```json
{
  "success": true,
  "data": {
    "topics": ["oil", "gas", "energy", ...],
    "sectors": ["Energy", "Manufacturing", ...],
    "regions": ["Northern America", "World", ...],
    "countries": ["United States of America", "Russia", ...],
    "pestles": ["Industries", "Economic", ...],
    "sources": ["OPEC", "Bloomberg", ...],
    "years": [2016, 2017, 2018, ...]
  }
}
```

### GET /api/analytics

Returns aggregated analytics data for charts.

**Query Parameters:**
- All dashboard filter parameters apply
- `type` - Specific analytics type (default: 'all')

**Response:**
```json
{
  "success": true,
  "data": {
    "kpi": {
      "totalInsights": 1000,
      "avgIntensity": 35.2,
      "avgRelevance": 3.8,
      "avgLikelihood": 2.1,
      "uniqueTopics": 97,
      "uniqueSectors": 18,
      "uniqueCountries": 56
    },
    "byTopic": [...],
    "bySector": [...],
    "byRegion": [...],
    "byCountry": [...],
    "byPestle": [...],
    "intensityDistribution": [...],
    "relevanceDistribution": [...],
    "likelihoodDistribution": [...],
    "intensityVsRelevance": [...]
  }
}
```

## Available Filters

The dashboard provides 10+ filters based on the actual dataset:

1. **Topic** (97 unique values) - Indexed, 90.7% populated
2. **Sector** (18 unique values) - Indexed, 77.1% populated
3. **Region** (23 unique values) - Indexed, 54.7% populated
4. **PESTLE** (9 unique values) - Indexed, 90.7% populated
5. **Source** (403 unique values) - Indexed, 99.9% populated
6. **Country** (56 unique values) - Indexed, 35% populated
7. **End Year** (2016-2200) - Indexed, 25.8% populated
8. **Intensity Range** (1-96) - Indexed, 96.2% populated
9. **Relevance Range** (1-7) - Indexed, 99.9% populated
10. **Likelihood Range** (1-4) - Indexed, 96.2% populated

**Note:** The dataset does not contain `city` or `swot` fields. The `region` field provides geographic data, and `pestle` provides category analysis.

## Charts & Visualizations

The dashboard includes 8 interactive charts:

1. **Intensity Distribution** - Histogram of intensity levels
2. **Relevance Distribution** - Bar chart of relevance levels
3. **Likelihood Distribution** - Bar chart of likelihood levels
4. **PESTLE Distribution** - Pie chart of PESTLE categories
5. **Sector Analysis** - Bar chart of records by sector
6. **Top Topics** - Horizontal bar chart of top 20 topics
7. **Region Distribution** - Pie chart of geographic regions
8. **Top Countries** - Bar chart of top 15 countries

## Data Quality Notes

### Strong Fields (90%+ populated)
- `intensity`: 96.2% populated
- `relevance`: 99.9% populated
- `likelihood`: 96.2% populated
- `pestle`: 90.7% populated
- `topic`: 90.7% populated
- `source`: 99.9% populated

### Sparse Fields (Use cautiously)
- `country`: 35% populated
- `region`: 54.7% populated
- `end_year`: 25.8% populated
- `start_year`: 31% populated
- `impact`: 3.4% populated (not visualized)

### Missing Fields (Not in dataset)
- `city` - Use `region` instead
- `swot` - Use `pestle` categories instead

## MongoDB Schema

```typescript
{
  _id: ObjectId,
  title: String (required),
  insight: String (required),
  url: String (required),
  intensity: Number (1-96, sparse),
  relevance: Number (1-7, sparse),
  likelihood: Number (1-4, sparse),
  topic: String (sparse, indexed),
  sector: String (sparse, indexed),
  region: String (sparse, indexed),
  country: String (sparse, indexed),
  pestle: String (sparse, indexed),
  source: String (sparse, indexed),
  end_year: Number (sparse),
  start_year: Number (sparse),
  impact: Number (sparse),
  added: String (required),
  published: String (sparse),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Performance Optimizations

1. **MongoDB Indexes**: Created on frequently filtered fields
2. **Pagination**: Data table is paginated (50 records per page)
3. **Server-side Aggregation**: Analytics computed on server
4. **React Memoization**: Components memoized where beneficial
5. **Debounced Filters**: Filter changes debounced to prevent excessive API calls
6. **Efficient Queries**: Optimized MongoDB queries with projections

## Error Handling

The application gracefully handles:
- Missing/empty field values (displays "N/A")
- Invalid numeric values
- MongoDB connection failures
- API errors with user-friendly messages
- Empty result sets with empty state UI

## Mobile Responsiveness

The dashboard is fully responsive:
- **Desktop**: Multi-column grid layout with all features
- **Tablet**: 2-column grid, collapsible filters
- **Mobile**: Single column, stacked filters, horizontal scrolling table

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string

### Optional
- `NODE_ENV` - Set to `production` for production builds

## Troubleshooting

### MongoDB Connection Error

**Error**: `MongoDB connection failed`

**Solution**:
1. Check your MongoDB URI in `.env.local`
2. Ensure MongoDB is running (if using local)
3. Verify network access (if using MongoDB Atlas)
4. Check MongoDB username/password

### Data Not Showing

**Error**: Charts and tables are empty

**Solution**:
1. Run `npm run import-data` to import the dataset
2. Check MongoDB has data: `db.insights.countDocuments()`
3. Verify API endpoint: `curl http://localhost:3000/api/filters`

### Build Error

**Error**: `TypeScript compilation error`

**Solution**:
1. Run `npm run lint` to see specific errors
2. Check all types are properly imported
3. Ensure `.env.local` is configured

## Performance Tips

- The application handles 1,000+ records efficiently
- Charts are rendered on-demand with React Recharts
- Filters use AND logic to narrow down results
- Pagination prevents loading all records at once

## Future Enhancements

Possible improvements:
- Add export to CSV/PDF functionality
- Add data refresh interval
- Add custom date range filters
- Implement dashboard favorites
- Add user authentication
- Create admin panel for data management
- Add real-time data updates with WebSockets
- Implement caching strategies

## License

This is a private hiring assignment. Do not publish publicly.

## Support

For issues or questions, refer to the analysis report at `ANALYSIS_REPORT.md`.

---

**Built with ❤️ using Next.js, React, and MongoDB**
