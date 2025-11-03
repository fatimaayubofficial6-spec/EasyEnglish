import { MongoClient } from "mongodb";

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not defined. Using in-memory session storage. Sessions will not persist across restarts."
  );
}

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/easyenglish";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
