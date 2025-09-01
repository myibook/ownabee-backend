import express, { RequestHandler } from "express";
import multer from "multer";
import {
  createCover,
  deleteCover,
  getAllCovers,
  getCoverById,
  updateCover,
} from "../../controllers/audioBooks/cover.controller";

const router = express.Router();
const upload = multer();

router.get("/:id", getCoverById as RequestHandler);
router.get("/", getAllCovers);
router.post("/", upload.single("file"), createCover);
router.patch("/:id", updateCover);
router.delete("/:id", deleteCover);

export default router;
