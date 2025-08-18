import express, { RequestHandler } from "express";
import {
  createPageTts,
  deletePageTts,
  getAllPageTts,
  getPageTtsById,
  updatePageTts,
} from "../../controllers/audioBooks/pageTts.controller";

const router = express.Router();

router.get("/:id", getPageTtsById as RequestHandler);
router.get("/", getAllPageTts);
router.post("/", createPageTts);
router.patch("/:id", updatePageTts);
router.delete("/:id", deletePageTts);

export default router;
