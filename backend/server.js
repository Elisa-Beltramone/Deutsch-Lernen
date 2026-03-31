import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import writingRoutes from "./routes/writing.js";
import readingRoutes from "./routes/reading.js";
import vocabularyRoutes from "./routes/vocabularyRoute.js";
import trackingRoutes from "./routes/tracking.js";
import db from "./db/db.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/users", async (req, res) => {
  const result = await db.query("SELECT * FROM users");
  res.json(result.rows);
});


app.get("/api/progress", async (req, res) => {
  const userId = 1;

  const result = await db.query(
    'SELECT content, COUNT(*) as count FROM writings GROUP BY content'
  );

  const daily = await db.query(`
    SELECT session_date, SUM(minutes_spent) as total
    FROM user_activity
    WHERE user_id = $1
    GROUP BY session_date
    ORDER BY session_date
  `, [userId]);

  const total = await db.query(`
    SELECT SUM(minutes_spent) as total
    FROM user_activity
    WHERE user_id = $1
  `, [userId]);

  res.json({
    daily: daily.rows,
    total: total.rows[0].total,
    result: result.rows
  });
});

app.post("/write", async (req, res) => {
  const { content } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO writings (original_content, content, level) VALUES ($1, $2, $3) RETURNING *',
      [originalContent, content, level]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving text");
  }
});

app.get("/api/writings", async (req, res) => {
  const userId = 1;

  try {
    const result = await db.query(
      "SELECT content, level, created_at FROM writings ORDER BY created_at DESC",
    );
    console.log("DB rows:", result.rows);
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching writings");
  }
});

/* ROUTES */
app.use("/api/writing", writingRoutes);
app.use("/api/reading", readingRoutes);
app.use("/api/vocabulary", vocabularyRoutes);
app.use("/api/tracking", trackingRoutes);



/* STATIC FILES */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../public")));

/* SERVER */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});