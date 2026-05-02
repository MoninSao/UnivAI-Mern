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

    const recCollection = db.collection("recommendations");

    // DATE 1: when the student last edited their profile (name/GPA/major)
    // Falls back to Jan 1 1970 if updatedAt doesn't exist, so any cached result counts as fresh
    const profileUpdatedAt = profile.updatedAt ?? new Date(0);

    // DATE 2: look for a saved GPT result whose createdAt (when GPT was called) is >= profileUpdatedAt
    // i.e. "Was GPT called AFTER the last profile change?"
    // YES (cache hit)  → result is still valid, skip GPT
    // NO  (cache miss) → profile changed since last run, call GPT again
    const cached = await recCollection.findOne({
        profileId: profileId,
        createdAt: { $gte: profileUpdatedAt }, // $gte = greater than or equal to
    });

    if (cached) {
        console.log(`⚡ [POST /recommendations] Cache hit — returning saved recommendations`);
        return res.status(200).json({ recommendations: cached.recommendations });
    }

    console.log(`🤖 [POST /recommendations] Cache miss — calling OpenAI`);
    const universities = await fetchUniversities();
    const recommendations = await getRecommendations(profile, universities);

    // Save GPT result with createdAt = now. upsert replaces the old doc if one exists,
    // so there is always exactly one cached recommendation per profile.
    await recCollection.replaceOne(
        { profileId: profileId },
        { profileId: profileId, recommendations, createdAt: new Date() },
        { upsert: true }
    );

    console.log(`✅ [POST /recommendations] Returning ${recommendations.length} recommendations`);
    res.status(200).json({ recommendations });
});

export default router;