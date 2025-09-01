import express from "express";

import audioBooksRoutes from "./audioBooks/routes";
import ttsRoutes from "./tts/routes";
import grammarRoutes from "./grammar/routes";
import storyImagesRoutes from "./storyImages/routes";
import userRoutes from "./user";
import { authenticate } from "../middleware/authMiddleware";
const router = express.Router();

router.use("/audiobooks", authenticate, audioBooksRoutes);
router.use("/tts", authenticate, ttsRoutes);
router.use("/grammar", authenticate, grammarRoutes);
router.use("/user", authenticate, userRoutes);
router.use("/storyImages", authenticate, storyImagesRoutes);

// router.use("/audiobooks", authenticate, audioBooksRoutes);
// router.use("/user", authenticate, userRoutes);

export default router;
