import express, { RequestHandler } from "express";
import {
  createEdition,
  deleteEdition,
  getAllEditions,
  getEditionById,
  updateEdition,
  updatePagesForEdition,
  getEditionWithTtsAudio,
} from "../../controllers/audioBooks/edition.controller";

const router = express.Router();

router.get("/:id", getEditionById as RequestHandler);
router.get("/", getAllEditions);
router.post("/", createEdition);
router.patch("/:id", updateEdition);
router.delete("/:id", deleteEdition);

router.patch("/:editionId/pages", updatePagesForEdition as RequestHandler);
router.get("/:id/with-tts", getEditionWithTtsAudio as RequestHandler);

export default router;
