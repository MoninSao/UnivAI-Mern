import express from "express";
import cors from "cors";
import profiles from "./routes/profile.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/profile", profiles);

//start the express server
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});
