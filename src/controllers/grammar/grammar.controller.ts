import { Request, Response } from "express";
import * as btob from "../../services/btob";

export const checkGrammar = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Missing required fields" });

    const apiResponse = await btob.checkGrammar(text);

    res.status(200).json(apiResponse);
  } catch (error) {
    console.error("Error checking grammar:", error);
    res.status(500).json({ error: "Failed to check grammar" });
  }
};
