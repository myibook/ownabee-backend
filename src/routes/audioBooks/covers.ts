import express, { RequestHandler } from "express";
import {
  createCover,
  deleteCover,
  getAllCovers,
  getCoverById,
  updateCover,
} from "../../controllers/audioBooks/cover.controller";

const router = express.Router();

router.get("/:id", getCoverById as RequestHandler);
router.get("/", getAllCovers);
router.post("/", createCover);
router.patch("/:id", updateCover);
router.delete("/:id", deleteCover);

export default router;
