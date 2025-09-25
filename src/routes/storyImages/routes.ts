import express, { RequestHandler } from "express";
import { 
  generateCharactersForEdition,
  generateSceneImageWithCharacters,
  getEditionImages,
  getPageTextImages
} from "../../controllers/storyImages/storyImages.controller";

const router = express.Router();

router.post("/generate-characters", generateCharactersForEdition as unknown as RequestHandler);
router.post("/generate-image-with-characters", generateSceneImageWithCharacters as unknown as RequestHandler);
router.get("/editions/:editionId/images", getEditionImages as unknown as RequestHandler);
router.get("/page-texts/:pageTextId/images", getPageTextImages as unknown as RequestHandler);

export default router;
