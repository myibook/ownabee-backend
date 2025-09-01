import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllPageTexts = async (req: Request, res: Response) => {
  try {
    const pageTexts = await prisma.audioBookPageText.findMany();
    res.status(200).json(pageTexts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getPageTextByEditionId = async (req: Request, res: Response) => {
  const { audioBookEditionId } = req.params;
  try {
    const pageText = await prisma.audioBookPageText.findMany({
      where: { audioBookEditionId },
    });
    if (!pageText) return res.status(404).json({ error: "Audiobook pageTexts not found" });
    res.status(200).json(pageText);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getPageTextById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageText = await prisma.audioBookPageText.findUnique({
      where: { id },
    });
    if (!pageText) return res.status(404).json({ error: "Audiobook pageTexts not found" });
    res.status(200).json(pageText);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createOrUpdateTexts = async (req: Request, res: Response) => {
  const { texts } = req.body;
  try {
    const upsertedTexts = [];
    for (const [, textData] of texts.entries()) {
      const {
        id,
        originalText = "",
        grammarCorrectedText = "",
        audioBookEditionId,
        grammarChecked = false,
        order,
      } = textData;

      if (id) {
        // 기존 텍스트 찾기
        const existing = await prisma.audioBookPageText.findUnique({
          where: { id },
        });

        if (existing) {
          // 내용 같으면 update 생략
          if (existing.originalText === originalText && existing.order === order) continue;

          const updated = await prisma.audioBookPageText.update({
            where: { id },
            data: { originalText, order },
          });
          upsertedTexts.push(updated);
          continue;
        }
      }
      // 새 텍스트 생성
      const created = await prisma.audioBookPageText.create({
        data: {
          audioBookEditionId,
          originalText,
          order,
          grammarCorrectedText,
          grammarChecked,
          userId: req.user!.userId,
        },
      });
      upsertedTexts.push(created);
    }

    res.status(201).json({ texts: upsertedTexts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save texts" });
  }
};

export const updateGrammarCorrectedText = async (req: Request, res: Response) => {
  const { textId, correctedText } = req.body;

  try {
    if (!textId || !correctedText) {
      return res.status(400).json({ error: "pageId and correctedText are required" });
    }

    const existing = await prisma.audioBookPageText.findFirst({
      where: { id: textId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Page text not found" });
    }

    const updated = await prisma.audioBookPageText.update({
      where: { id: existing.id },
      data: {
        grammarCorrectedText: correctedText,
        grammarChecked: true,
      },
    });

    res.status(200).json(updated);
  } catch (error) {
    console.error("updatePageTextGrammar error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePageText = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageText = await prisma.audioBookPageText.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(pageText);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deletePageText = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedPageText = await prisma.audioBookPageText.findUnique({
      where: { id },
    });
    if (!deletedPageText) {
      return res.status(404).json({ error: "Page text not found" });
    }

    await prisma.audioBookPageText.delete({ where: { id } });
    await prisma.audioBookPageText.updateMany({
      where: {
        audioBookEditionId: deletedPageText.audioBookEditionId,
        order: { gt: deletedPageText.order },
      },
      data: {
        order: { decrement: 1 },
      },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
