import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllCoverElements = async (req: Request, res: Response) => {
  try {
    const coverElements = await prisma.audioBookCoverElement.findMany();
    res.status(200).json(coverElements);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getCoverElementById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const coverElement = await prisma.audioBookCoverElement.findUnique({
      where: { id },
    });
    if (!coverElement)
      return res
        .status(404)
        .json({ error: "Audiobook CoverElements not found" });
    res.status(200).json(coverElement);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createCoverElement = async (req: Request, res: Response) => {
  try {
    const coverElement = await prisma.audioBookCoverElement.create({
      data: { ...req.body },
    });
    res.status(201).json(coverElement);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updateCoverElement = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const coverElement = await prisma.audioBookCoverElement.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(coverElement);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deleteCoverElement = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookCoverElement.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
