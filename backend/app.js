import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import writingRoutes from "./routes/api/writingRoutes.js";
import readingRoutes from "./routes/api/readingRoutes.js";
import vocabularyRoutes from "./routes/api/vocabularyRoutes.js";
import trackingRoutes from "./routes/api/trackingRoutes.js";
import userRoutes from "./routes/api/userRoutes.js";
import progressRoutes from "./routes/api/progressRoutes.js";
import db from "./db/db.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/writing", writingRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/tracking", trackingRoutes);

// static frontend
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend")));

export default app;