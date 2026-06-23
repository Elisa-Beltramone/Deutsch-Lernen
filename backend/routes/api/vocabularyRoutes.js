import express from "express";
import { getSentence } from "../../controllers/vocabularyController.js";

const router = express.Router();

router.get("/:word", getSentence);

export default router;