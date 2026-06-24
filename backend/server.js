import dotenv from "dotenv";
import app from "./app.js";
import { testDB } from "./db/testDb.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  await testDB();
});