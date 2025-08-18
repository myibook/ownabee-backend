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

export const getPageTextById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageText = await prisma.audioBookPageText.findUnique({
      where: { id },
    });
    if (!pageText)
      return res.status(404).json({ error: "Audiobook pageTexts not found" });
    res.status(200).json(pageText);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createPageText = async (req: Request, res: Response) => {
  const { pages } = req.body;
  try {
    const createdTexts = [];

    for (const [index, page] of pages.entries()) {
      const { id: pageId, text } = page;

      if (!pageId || !text?.trim()) continue;

      const existing = await prisma.audioBookPageText.findFirst({
        where: { pageId },
      });

      if (existing) {
        // 기존 텍스트와 동일하다면 update 생략
        if (existing.text === text && existing.order === index) continue;

        const updated = await prisma.audioBookPageText.update({
          where: { id: existing.id },
          data: { text, order: index },
        });
        createdTexts.push(updated);
      } else {
        const created = await prisma.audioBookPageText.create({
          data: { pageId, text, order: index },
        });
        createdTexts.push(created);
      }
    }

    res.status(201).json({ texts: createdTexts });
  } catch (error) {
    res.status(500).json({});
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
    await prisma.audioBookPageText.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
