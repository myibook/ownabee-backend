import express, { RequestHandler } from "express";
import {
  createOrUpdateTexts,
  deletePageText,
  getAllPageTexts,
  getPageTextByEditionId,
  getPageTextById,
  updateGrammarCorrectedText,
  updatePageText,
} from "../../controllers/audioBooks/pageText.controller";

const router = express.Router();

router.get("/by-id/:id", getPageTextById as RequestHandler);
router.get("/by-edition/:audioBookEditionId", getPageTextByEditionId as RequestHandler);
router.get("/", getAllPageTexts);
router.post("/", createOrUpdateTexts);
router.put("/grammar", updateGrammarCorrectedText as RequestHandler);
router.patch("/:id", updatePageText);
router.delete("/:id", deletePageText as RequestHandler);

export default router;
