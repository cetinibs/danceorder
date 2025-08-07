import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI ortam değişkeni tanımlanmamış.')
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient | undefined
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri as string, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise as Promise<MongoClient>
} else {
  client = new MongoClient(uri as string, options)
  clientPromise = client.connect()
}

export default clientPromise