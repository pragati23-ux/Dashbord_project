import mongoose, { Schema, Document } from 'mongoose'

interface IInsight extends Document {
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

const InsightSchema = new Schema<IInsight>(
  {
    end_year: {
      type: Number,
      sparse: true,
    },
    intensity: {
      type: Number,
      sparse: true,
      index: true,
    },
    sector: {
      type: String,
      sparse: true,
      index: true,
    },
    topic: {
      type: String,
      sparse: true,
      index: true,
    },
    insight: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      sparse: true,
      index: true,
    },
    start_year: {
      type: Number,
      sparse: true,
    },
    impact: {
      type: Number,
      sparse: true,
    },
    added: {
      type: String,
      required: true,
    },
    published: {
      type: String,
      sparse: true,
    },
    country: {
      type: String,
      sparse: true,
      index: true,
    },
    relevance: {
      type: Number,
      sparse: true,
      index: true,
    },
    pestle: {
      type: String,
      sparse: true,
      index: true,
    },
    source: {
      type: String,
      sparse: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    likelihood: {
      type: Number,
      sparse: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes for efficient filtering
InsightSchema.index({ topic: 1, sector: 1, region: 1 })
InsightSchema.index({ intensity: 1, relevance: 1, likelihood: 1 })

export default mongoose.models.Insight ||
  mongoose.model<IInsight>('Insight', InsightSchema)
