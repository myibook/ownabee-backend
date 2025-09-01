import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { get } from "http";
import { getCoverImageSignedUrl } from "../../utils/pageCover";

export const getAllAudioBooks = async (req: Request, res: Response) => {
  try {
    const books = await prisma.audioBook.findMany();

    const booksWithPageCount = (
      await Promise.all(
        books.map(async (book) => {
          // Fetch the latest edition for the book
          const edition = await prisma.audioBookEdition.findFirst({
            where: {
              audioBookId: book.id,
              OR: [{ userId: req.user!.userId }, { userId: null }],
            },
            orderBy: { createdAt: "desc" },
          });

          let pageCount = 0;
          let coverPage;
          if (edition?.id) {
            pageCount = await prisma.audioBookPage.count({
              where: { audioBookEditionId: edition.id },
            });
            coverPage = await prisma.audioBookCover.findFirst({
              where: { audioBookEditionId: edition.id },
            });
          }

          // Exclude books without coverPage
          if (!coverPage || !edition) return null;

          const coverPageUrl = await getCoverImageSignedUrl(edition.id, coverPage.id);

          return {
            ...book,
            editionId: edition?.id,
            coverPage,
            coverPageUrl,
            pageCount,
          };
        })
      )
    ).filter((book) => book !== null);

    res.status(200).json(booksWithPageCount);
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
    const coverPage = await prisma.audioBookCover.findFirst({
      where: { audioBookEditionId: edition!.id },
    });

    const coverPageUrl = await getCoverImageSignedUrl(edition!.id, coverPage!.id);

    // 4. 최종 응답
    return res.status(200).json({
      ...book,
      editionId: edition?.id,
      coverPageUrl,
      pageCount,
    });
  } catch (error) {
    res.status(500).json({});
  }
};

export const createAudioBook = async (req: Request, res: Response) => {
  try {
    const book = await prisma.audioBook.create({
      data: {
        ...req.body,
        userId: req.user!.userId,
        editions: {
          create: [{ userId: req.user!.userId }],
        },
      },
      include: { editions: true },
    });

    res.status(201).json(book);
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
