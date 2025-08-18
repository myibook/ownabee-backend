import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllPageTts = async (req: Request, res: Response) => {
  try {
    const pageTts = await prisma.audioBookPageTts.findMany();
    res.status(200).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getPageTtsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageTts = await prisma.audioBookPageTts.findUnique({ where: { id } });
    if (!pageTts)
      return res.status(404).json({ error: "Audiobook pageTtss not found" });
    res.status(200).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createPageTts = async (req: Request, res: Response) => {
  try {
    const pageTts = await prisma.audioBookPageTts.create({
      data: { ...req.body },
    });
    res.status(201).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updatePageTts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageTts = await prisma.audioBookPageTts.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deletePageTts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookPageTts.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
