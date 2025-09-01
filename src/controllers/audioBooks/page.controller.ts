import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllPages = async (req: Request, res: Response) => {
  try {
    const page = await prisma.audioBookPage.findMany();
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getPageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const page = await prisma.audioBookPage.findUnique({ where: { id } });
    if (!page) return res.status(404).json({ error: "Audiobook page not found" });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.audioBookPage.create({ data: { ...req.body, userId: req.user!.userId } });
    res.status(201).json(page);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updatePage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const page = await prisma.audioBookPage.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(page);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deletePage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookPage.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
