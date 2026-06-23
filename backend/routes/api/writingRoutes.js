import express from "express";
import {
  saveWriting,
  getWritings,
  saveFeedback,
  checkWritingLevel,
} from "../../controllers/writingController.js";

const router = express.Router();

router.post("/", saveWriting);
router.get("/", getWritings);
router.post("/save-feedback", saveFeedback);
router.post("/:level", checkWritingLevel);

export default router;