import express from "express";
import { getReadingExercise } from "../../controllers/readingController.js";

const router = express.Router();

router.get("/:level", getReadingExercise);

export default router;