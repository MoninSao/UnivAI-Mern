// POST /recommendations
// Body: { profileId }
// Fetches the student profile from MongoDB, fetches universities from College Scorecard,
// then calls OpenAI to return the top 5 matched universities with reasons

import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
import { fetchUniversities } from "../external_api/college_scorecard.js";
import { getRecommendations } from "../external_api/openai.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { profileId } = req.body;
    console.log(`📥 [POST /recommendations] Received request for profileId: ${profileId}`);

    if (!profileId) {
        console.warn("⚠️ [POST /recommendations] Missing profileId in request body");
        return res.status(400).json({ error: "profileId is required" });
    }

    let profile;
    try {
        const collection = db.collection("profiles");
        profile = await collection.findOne({ _id: new ObjectId(profileId) });
    } catch (err) {
        console.error("❌ [POST /recommendations] Invalid profileId format:", err.message);
        return res.status(400).json({ error: "Invalid profileId format" });
    }

    if (!profile) {
        console.warn(`⚠️ [POST /recommendations] No profile found for id: ${profileId}`);
        return res.status(404).json({ error: "Profile not found" });
    }

    console.log(`👤 [POST /recommendations] Profile found: ${profile.name}`);

    const universities = await fetchUniversities();
    const recommendations = await getRecommendations(profile, universities);

    console.log(`✅ [POST /recommendations] Returning ${recommendations.length} recommendations`);
    res.status(200).json({ recommendations });
});

export default router;