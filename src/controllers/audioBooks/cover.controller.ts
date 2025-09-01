import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { getCoverImageSignedUrl, uploadCoverImageToS3 } from "../../utils/pageCover";

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
    if (!cover) return res.status(404).json({ error: "Audiobook Covers not found" });
    const coverPageUrl = await getCoverImageSignedUrl(cover.audioBookEditionId, cover.id);
    res.status(200).json({ ...cover, coverPageUrl });
  } catch (error) {
    res.status(500).json({});
  }
};

export const createCover = async (req: Request, res: Response) => {
  try {
    const { audioBookEditionId, components } = req.body;
    let cover = await prisma.audioBookCover.findUnique({ where: { audioBookEditionId } });
    if (cover) {
      cover = await prisma.audioBookCover.update({
        where: { id: cover.id },
        data: { components },
      });
    } else {
      cover = await prisma.audioBookCover.create({
        data: { audioBookEditionId, components, userId: req.user!.userId },
      });
    }
    await uploadCoverImageToS3(audioBookEditionId, cover.id, req.file!.buffer);
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
