// This file defines the Express API endpoints for the profiles collection
// It acts as a middleman between the React client (frontend) and MongoDB database
// It receives HTTP requests from the client and queries the database, then sends responses back
// Profiles is a collection in the MongoDB database
// It has 5 CRUD operations: Create, Read (all), Read (one), Update, Delete

import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id form string to objectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path/profile.
const router = express.Router();

// This section will help you get a list of all the profiles.
router.get("/", async (req, res) => {
    console.log("[GET /profiles] Request received");
    let collection = await db.collection("profiles");
    let results = await collection.find({}).toArray();
    console.log("[GET /profiles] Returning", results.length, "profiles:", results);
    res.send(results).status(200);
});

//This section will help you get a single profile by id
router.get("/:id", async (req, res) => {
    console.log("[GET /profiles/:id] Looking up id:", req.params.id);
    let collection = await db.collection("profiles");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
        console.warn("[GET /profiles/:id] Not found for id:", req.params.id);
        res.send("Not found").status(404);
    } else {
        console.log("[GET /profiles/:id] Found:", result);
        res.send(result).status(200);
    }
})

// This section will help you create a new profile
router.post("/", async (req, res) => {
    console.log("[POST /profiles] Request body:", req.body);
    try {
        let newProfile = {
            name: req.body.name,
            gpa: req.body.gpa,
            major: req.body.major,
        };
        console.log("[POST /profiles] Inserting:", newProfile);
        let collection = await db.collection("profiles");
        let result = await collection.insertOne(newProfile);
        console.log("[POST /profiles] Insert result:", result);
        res.send(result).status(204);
    } catch (err) {
        console.error("[POST /profiles] Error:", err);
        res.status(500).send("Error adding profile");
    }
});

// This section will help you update a profile by id
router.patch("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };
        const updates = {
            $set: {
                name: req.body.name,
                gpa: req.body.gpa,
                major: req.body.major,
            },
        };
        let collection = await db.collection("profiles");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating profile");
    }
});

// This section will help you delete a profile by id
router.delete("/:id", async (req, res) => {
    try {
        const query = { _id: new ObjectId(req.params.id) };

        let collection = await db.collection("profiles");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting profile");
    }
});

export default router;