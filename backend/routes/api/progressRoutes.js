import express from "express";
import { verifyToken } from "../../middleware/authMiddleware.js";
import { getProgress } from "../../controllers/progressController.js";

const router = express.Router();

router.get("/", verifyToken, getProgress);

export default router;