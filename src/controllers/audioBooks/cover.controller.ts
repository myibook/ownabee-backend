import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllCovers = async (req: Request, res: Response) => {
  try {
    const cover = await prisma.audioBookCover.findMany();
    res.status(200).json(cover);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getCoverById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cover = await prisma.audioBookCover.findUnique({ where: { id } });
    if (!cover)
      return res.status(404).json({ error: "Audiobook Covers not found" });
    res.status(200).json(cover);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createCover = async (req: Request, res: Response) => {
  try {
    const cover = await prisma.audioBookCover.create({ data: { ...req.body } });
    res.status(201).json(cover);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updateCover = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cover = await prisma.audioBookCover.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(cover);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deleteCover = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookCover.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
