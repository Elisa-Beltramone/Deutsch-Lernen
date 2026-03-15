import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import writingRoutes from "./routes/writing.js";
import readingRoutes from "./routes/reading.js";
import vocabularyRoutes from "./routes/vocabularyRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/writing", writingRoutes); 
app.use("/api/reading", readingRoutes); 
app.use("/api/vocabulary", vocabularyRoutes);


/* STATIC FILES */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../"))); // serves your HTML, CSS, JS

/* SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});