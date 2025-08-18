import express, { RequestHandler } from "express";
import {
  createPage,
  deletePage,
  getAllPages,
  getPageById,
  updatePage,
} from "../../controllers/audioBooks/page.controller";

const router = express.Router();

router.get("/:id", getPageById as RequestHandler);
router.get("/", getAllPages);
router.post("/", createPage);
router.patch("/:id", updatePage);
router.delete("/:id", deletePage);

export default router;
