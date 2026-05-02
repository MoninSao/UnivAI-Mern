// This file defines the Express API endpoint for fetching universities
// It calls the College Scorecard external API and returns the results to the client
// No database involvement — data is fetched live on each request

import express from "express";
import { fetchUniversities } from "../external_api/college_scorecard.js";

const router = express.Router();

// Returns a list of universities from the College Scorecard API
router.get("/", async (req, res) => {
    console.log("[GET /university] Request received");
    const results = await fetchUniversities();
    res.status(200).json(results);
});

export default router;