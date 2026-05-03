// This file sets up and starts the Express server (backend)
// It configures middleware (CORS, JSON parsing) and connects API routes
// The server listens on port 5050 and handles requests from the React frontend

import "dotenv/config"
import express from "express";
import cors from "cors";
import profiles from "./routes/profile.js"
import universities from "./routes/university.js"
import recommendations from "./routes/reccomendation.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// This is where we wire or connect our API endpoints routes files, add more routes when you create new entities
app.use("/profile", profiles);
app.use("/university", universities);
app.use("/recommendations", recommendations);

//start the express server
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
