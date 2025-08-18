import express, { RequestHandler } from "express";
import {
  createPageText,
  deletePageText,
  getAllPageTexts,
  getPageTextById,
  updatePageText,
} from "../../controllers/audioBooks/pageText.controller";

const router = express.Router();

router.get("/:id", getPageTextById as RequestHandler);
router.get("/", getAllPageTexts);
router.post("/", createPageText);
router.patch("/:id", updatePageText);
router.delete("/:id", deletePageText);

export default router;
