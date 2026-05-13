// Provides a lazy, cached MongoDB connection for use in Lambda (and local dev).
// Exporting getDb() instead of a top-level connection allows Lambda warm invocations
// to reuse the existing connection rather than reconnecting on every request.

import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.ATLAS_URI || "";

// Cached across warm Lambda invocations — null on first cold start
let cachedDb = null;

// Tracks an in-flight connect attempt to prevent duplicate connections
// when multiple concurrent requests hit a cold start simultaneously
let connectPromise = null;

export async function getDb() {
    // Warm invocation: return the already-open database handle
    if (cachedDb) return cachedDb;

    // Cold start already in progress (concurrent requests): wait on the same promise
    if (connectPromise) return connectPromise;

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
        // Fail fast — Lambda has a hard timeout, so don't hang the full invocation
        serverSelectionTimeoutMS: 5000,
    });

    connectPromise = client.connect()
        .then(() => {
            console.log("Connected to MongoDB Atlas");
            // Cache the db handle so warm invocations skip reconnecting
            cachedDb = client.db("univs");
            return cachedDb;
        })
        .catch((err) => {
            // Reset so the next invocation can retry the connection
            connectPromise = null;
            throw err;
        });

    return connectPromise;
}

