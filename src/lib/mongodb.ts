import mongoose, { Connection } from 'mongoose'

let cachedConnection: Connection | null = null
let connectionPromise: Promise<Connection> | null = null

export async function connectDB(): Promise<Connection> {
  if (cachedConnection?.readyState === 1) {
    return cachedConnection
  }

  if (connectionPromise) {
    return connectionPromise
  }

  const mongodbUri = process.env.MONGODB_URI
  if (!mongodbUri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    )
  }

  connectionPromise = mongoose
    .connect(mongodbUri, {
      bufferCommands: false,
    })
    .then((conn) => {
      cachedConnection = conn.connection

      console.log('MongoDB connected successfully')
      return cachedConnection
    })
    .catch((error) => {
      cachedConnection = null
      connectionPromise = null
      console.error('MongoDB connection failed:', error)
      throw error
    })

  return connectionPromise
}

export async function disconnectDB(): Promise<void> {
  if (cachedConnection) {
    await mongoose.disconnect()
    cachedConnection = null
  }
  connectionPromise = null
}
