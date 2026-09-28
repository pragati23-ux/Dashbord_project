export interface Insight {
  _id: string;
  end_year?: number;
  intensity?: number;
  sector?: string;
  topic?: string;
  insight: string;
  url: string;
  region?: string;
  start_year?: number;
  impact?: number;
  added: string;
  published?: string;
  country?: string;
  relevance?: number;
  pestle?: string;
  source?: string;
  title: string;
  likelihood?: number;
}

export interface FilterOptions {
  topics: string[];
  sectors: string[];
  regions: string[];
  countries: string[];
  pestles: string[];
  sources: string[];
  years: number[];
}

export interface DashboardFilter {
  endYear?: number;
  topic?: string;
  sector?: string;
  region?: string;
  pestle?: string;
  source?: string;
  country?: string;
  minIntensity?: number;
  maxIntensity?: number;
  minRelevance?: number;
  maxRelevance?: number;
  minLikelihood?: number;
  maxLikelihood?: number;
  search?: string;
}

export interface KPIData {
  totalInsights: number;
  avgIntensity: number;
  avgLikelihood: number;
  avgRelevance: number;
  uniqueTopics: number;
  uniqueSectors: number;
  uniqueCountries: number;
}

export interface ChartData {
  label?: string;
  name?: string;
  value: number;
  count?: number;
  intensity?: number;
  relevance?: number;
  likelihood?: number;
  x?: number | string;
  y?: number;
}
