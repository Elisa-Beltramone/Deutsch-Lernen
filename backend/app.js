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
import authRoutes from "./routes/api/authRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/writing", writingRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/auth", authRoutes);

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

export default app;