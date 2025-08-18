import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllEditions = async (req: Request, res: Response) => {
  try {
    const editions = await prisma.audioBookEdition.findMany();
    console.log("editions: ", editions);
    res.status(200).json(editions);
  } catch (error) {
    console.log("Error fetching editions: ", error);
    res.status(500).json({});
  }
};

export const getEditionById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const edition = await prisma.audioBookEdition.findUnique({ where: { id } });
    if (!edition)
      return res.status(404).json({ error: "Audiobook editions not found" });
    res.status(200).json(edition);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createEdition = async (req: Request, res: Response) => {
  try {
    const edition = await prisma.audioBookEdition.create({
      data: { ...req.body },
    });
    res.status(201).json(edition);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updateEdition = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const edition = await prisma.audioBookEdition.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(edition);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deleteEdition = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookEdition.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
