import { Request, Response } from "express";
import { prisma } from "../../prisma";

export const getAllAudioBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.audioBook.findMany();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getAudioBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // 1. 오디오북 조회
    const book = await prisma.audioBook.findUnique({
      where: { id },
    });

    if (!book) {
      return res.status(404).json({ error: "AudioBook not found" });
    }

    // 2. 해당 오디오북의 최신 에디션 가져오기
    const edition = await prisma.audioBookEdition.findFirst({
      where: { audioBookId: id },
      orderBy: { createdAt: "desc" }, // 가장 최신 에디션
    });

    let pageCount = 0;

    if (edition?.id) {
      // 3. 페이지 개수 가져오기
      pageCount = await prisma.audioBookPage.count({
        where: { audioBookEditionId: edition.id },
      });
    }

    // 4. 최종 응답
    return res.status(200).json({
      ...book,
      pageCount,
    });
  } catch (error) {
    res.status(500).json({});
  }
};

export const createAudioBook = async (req: Request, res: Response) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const book = await prisma.audioBook.create({ data: { ...req.body } });
      const edition = await tx.audioBookEdition.create({
        data: {
          audioBookId: book.id,
        },
      });
      const page = await tx.audioBookPage.create({
        data: {
          audioBookEditionId: edition.id,
          pageNum: 1,
          layoutType: "imageTopTextBottom",
        },
      });
      return { book, edition, page };
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({});
  }
};

export const updateAudioBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const book = await prisma.audioBook.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deleteAudioBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBook.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
