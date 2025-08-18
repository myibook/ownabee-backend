import express, { RequestHandler } from "express";
import {
  createEdition,
  deleteEdition,
  getAllEditions,
  getEditionById,
  updateEdition,
} from "../../controllers/audioBooks/edition.controller";

const router = express.Router();

router.get("/:id", getEditionById as RequestHandler);
router.get("/", getAllEditions);
router.post("/", createEdition);
router.patch("/:id", updateEdition);
router.delete("/:id", deleteEdition);

export default router;
