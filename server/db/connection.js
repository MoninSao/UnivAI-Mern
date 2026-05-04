// This file connects the Express server (backend) to MongoDB (database)

import { MongoClient, ServerApiVersion } from "mongodb";

// This file establishes and exports the MongoDB database connection
// It connects to MongoDB Atlas using the connection string from environment variables
// and provides access to the 'univs' database for use throughout the application

const uri = process.env.ATLAS_URI || "";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

try {
    //Connect the client to the server
    await client.connect();
    //Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
        "Pinged your development. You successfully connected to MongoDB!"
    );
} catch (err) {
    console.error(err);
    process.exit(1);
}
// get the univs database
let db = client.db("univs");

export default db;