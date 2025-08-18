import express from "express";

import audioBooksRoutes from "./audioBooks";
import editionsRoutes from "./editions";
import pagesRoutes from "./pages";
import pageImagesRoutes from "./pageImages";
import pageTextsRoutes from "./pageTexts";
import pageTtsRoutes from "./pageTts";
import coversRoutes from "./covers";
import coverElementsRoutes from "./coverElements";

const router = express.Router();

router.use("/editions", editionsRoutes);
router.use("/pages", pagesRoutes);
router.use("/page-texts", pageTextsRoutes);
router.use("/page-images", pageImagesRoutes);
router.use("/page-tts", pageTtsRoutes);
router.use("/covers", coversRoutes);
router.use("/cover-elements", coverElementsRoutes);
router.use("/", audioBooksRoutes);

export default router;
