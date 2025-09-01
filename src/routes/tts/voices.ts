import express, { RequestHandler } from "express";
import multer from "multer";
import {
  createVoice,
  deleteVoice,
  getAllVoices,
  getVoiceById,
  updateVoice,
  getAllVoicesWithReadyStatus,
} from "../../controllers/tts/voice.controller";

const router = express.Router();
const upload = multer();

router.get("/with-ready-status", getAllVoicesWithReadyStatus as RequestHandler);
router.get("/:id", getVoiceById as RequestHandler);
router.get("/", getAllVoices);
router.post("/", upload.array("files"), createVoice as RequestHandler);
router.patch("/:id", updateVoice);
router.delete("/:id", deleteVoice);

export default router;
