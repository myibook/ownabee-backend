import express from "express";

import audioBooksRoutes from "./audioBooks/routes";
import userRoutes from "./user";
import { authenticate } from "../middleware/authMiddleware";
const router = express.Router();

router.use("/audiobooks", audioBooksRoutes);
router.use("/user", userRoutes);

// router.use("/audiobooks", authenticate, audioBooksRoutes);
// router.use("/user", authenticate, userRoutes);

export default router;
