// This file defines the Express API endpoints for the profiles collection
// It acts as a middleman between the React client (frontend) and MongoDB database
// It receives HTTP requests from the client and queries the database, then sends responses back
// Profiles is a collection in the MongoDB database
// It has 5 CRUD operations: Create, Read (all), Read (one), Update, Delete

import express from "express";

// This will help us connect to the database
import {getDb} from "../db/connection.js";

// This help convert the id form string to objectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path/profile.
const router = express.Router();

// This section will help you get a list of all the profiles.
router.get("/", async (req, res) => {
    console.log("[GET /profile] Request received");
    const sessionId = req.headers["x-session-id"];
    if (!sessionId) {
        console.warn("[GET /profile] Missing X-Session-Id header");
        return res.status(400).json({ error: "Missing session ID" });
    }
    const db = await getDb();
    let collection = db.collection("profiles");
    let results = await collection.find({ sessionId }).toArray();
    console.log("[GET /profile] Returning", results.length, "profile:", results);
    res.send(results).status(200);
});

//This section will help you get a single profile by id
router.get("/:id", async (req, res) => {
    console.log("[GET /profile/:id] Looking up id:", req.params.id);
    const sessionId = req.headers["x-session-id"];
    const db = await getDb();
    let collection = db.collection("profiles");
    let query = { _id: new ObjectId(req.params.id), sessionId };
    let result = await collection.findOne(query);

    if (!result) {
        console.warn("[GET /profile/:id] Not found or session mismatch for id:", req.params.id);
        res.send("Not found").status(404);
    } else {
        console.log("[GET /profile/:id] Found:", result);
        res.send(result).status(200);
    }
})

// This section will help you create a new profile
router.post("/", async (req, res) => {
    console.log("[POST /profile] Request body:", req.body);
    try {
        // query the db first for the profile
        const db = await getDb()
        let collection = db.collection("profiles");
        // Count profiles for this session only
        const sessionId = req.headers["x-session-id"];
        const existing = await collection.countDocuments({ sessionId });
        // Only allow one profile per session
        if (existing >= 1) {
            console.warn("[POST /profile] Rejected — a profile already exists for this session");
            return res.status(409).send("Only one profile is allowed.");
        }
        let newProfile = {
            name: req.body.name,
            gpa: req.body.gpa,
            major: req.body.major,
            satScore: req.body.satScore,
            sessionId,
        };
        console.log("[POST /profile] Inserting:", newProfile);
        let result = await collection.insertOne(newProfile);
        console.log("[POST /profile] Insert result:", result);
        res.send(result).status(204);
    } catch (err) {
        console.error("[POST /profile] Error:", err);
        res.status(500).send("Error adding profile");
    }
});

// This section will help you update a profile by id
router.patch("/:id", async (req, res) => {
    try {
        const sessionId = req.headers["x-session-id"];
        const query = { _id: new ObjectId(req.params.id), sessionId };
        const db = await getDb();
        let collection = db.collection("profiles");

        // Only bump updatedAt (which invalidates the recommendations cache) if the
        // actual profile content changed — not just because the form was submitted.
        const existing = await collection.findOne(query);
        const contentChanged =
            !existing ||
            existing.name !== req.body.name ||
            existing.gpa !== req.body.gpa ||
            existing.major !== req.body.major ||
            existing.satScore !== req.body.satScore;

        const fields = {
            name: req.body.name,
            gpa: req.body.gpa,
            major: req.body.major,
            satScore: req.body.satScore,
        };
        if (contentChanged) {
            fields.updatedAt = new Date();
        }

        const updates = { $set: fields };
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
        const sessionId = req.headers["x-session-id"];
        const query = { _id: new ObjectId(req.params.id), sessionId };

        const db = await getDb()
        let collection = db.collection("profiles");
        let result = await collection.deleteOne(query);

        res.send(result).status(200);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting profile");
    }
});

export default router;