import express, { RequestHandler } from "express";
import { checkGrammar } from "../../controllers/grammar/grammar.controller";


const router = express.Router();

router.post("/check", checkGrammar as RequestHandler);

export default router;
