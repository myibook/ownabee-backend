import express, { RequestHandler } from "express";
import {
  createAudioBook,
  deleteAudioBook,
  getAllAudioBooks,
  getAudioBookById,
  updateAudioBook,
} from "../../controllers/audioBooks/audiobook.controller";

const router = express.Router();

router.get("/:id", getAudioBookById as RequestHandler);
router.get("/", getAllAudioBooks);
router.post("/", createAudioBook);
router.patch("/:id", updateAudioBook);
router.delete("/:id", deleteAudioBook);

export default router;
