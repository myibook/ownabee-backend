import express, { RequestHandler } from "express";
import {
  createCoverElement,
  deleteCoverElement,
  getAllCoverElements,
  getCoverElementById,
  updateCoverElement,
} from "../../controllers/audioBooks/coverElement.controller";

const router = express.Router();

router.get("/:id", getCoverElementById as RequestHandler);
router.get("/", getAllCoverElements);
router.post("/", createCoverElement);
router.patch("/:id", updateCoverElement);
router.delete("/:id", deleteCoverElement);

export default router;
