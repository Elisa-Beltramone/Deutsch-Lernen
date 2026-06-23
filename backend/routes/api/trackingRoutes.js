import express from "express";
import { trackTime } from "../../controllers/trackingController.js";

const router = express.Router();

router.post("/track-time", trackTime);

export default router;