// POST /recommendations
// Body: { profileId }
// Returns cached recommendations if profile hasn't changed since last run,
// otherwise calls OpenAI and saves the new result to MongoDB

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

    // Check for a cached recommendation newer than the last profile update.
    // Profiles without updatedAt (created before this change) are treated as always stale.
    const recCollection = db.collection("recommendations");
    const profileUpdatedAt = profile.updatedAt ?? new Date(0);
    const cached = await recCollection.findOne({
        profileId: profileId,
        createdAt: { $gte: profileUpdatedAt },
    });

    if (cached) {
        console.log(`⚡ [POST /recommendations] Cache hit — returning saved recommendations`);
        return res.status(200).json({ recommendations: cached.recommendations });
    }

    console.log(`🤖 [POST /recommendations] Cache miss — calling OpenAI`);
    const universities = await fetchUniversities();
    const recommendations = await getRecommendations(profile, universities);

    // Upsert: one cached result per profile, overwrite on re-run
    await recCollection.replaceOne(
        { profileId: profileId },
        { profileId: profileId, recommendations, createdAt: new Date() },
        { upsert: true }
    );

    console.log(`✅ [POST /recommendations] Returning ${recommendations.length} recommendations`);
    res.status(200).json({ recommendations });
});

export default router;