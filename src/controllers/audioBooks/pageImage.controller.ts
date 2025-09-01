import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllPageImages = async (req: Request, res: Response) => {
  try {
    const pageImages = await prisma.audioBookPageImage.findMany();
    res.status(200).json(pageImages);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getPageImageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageImage = await prisma.audioBookPageImage.findUnique({
      where: { id },
    });
    if (!pageImage) return res.status(404).json({ error: "Audiobook pageImages not found" });
    res.status(200).json(pageImage);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createPageImage = async (req: Request, res: Response) => {
  try {
    const pageImage = await prisma.audioBookPageImage.create({
      data: { ...req.body, userId: req.user!.userId },
    });
    res.status(201).json(pageImage);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updatePageImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageImage = await prisma.audioBookPageImage.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(pageImage);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deletePageImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookPageImage.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
