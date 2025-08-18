import express, { RequestHandler } from "express";
import {
  createPageImage,
  deletePageImage,
  getAllPageImages,
  getPageImageById,
  updatePageImage,
} from "../../controllers/audioBooks/pageImage.controller";

const router = express.Router();

router.get("/:id", getPageImageById as RequestHandler);
router.get("/", getAllPageImages);
router.post("/", createPageImage);
router.patch("/:id", updatePageImage);
router.delete("/:id", deletePageImage);

export default router;
