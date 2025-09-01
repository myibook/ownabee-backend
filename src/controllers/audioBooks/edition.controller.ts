import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { CanvasItem } from "../../types/audiobook";
import { Buckets } from "../../constants/app";
import { getSignedUrl } from "../../services/aws";
import { getCoverImageSignedUrl } from "../../utils/pageCover";

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
    if (!edition) return res.status(404).json({ error: "Audiobook editions not found" });
    res.status(200).json(edition);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getEditionWithTtsAudio = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ttsVoiceId } = req.query as { ttsVoiceId?: string };

    if (!id || !ttsVoiceId) return res.status(400).json({ error: "Missing required fields" });

    const edition = await prisma.audioBookEdition.findUnique({
      where: { id },
      include: {
        audioBook: { select: { title: true } },
        pages: {
          orderBy: { order: "asc" },
        },
        pageTexts: {
          include: {
            ttsAudios: { where: { ttsVoiceId } },
          },
        },
      },
    });

    if (!edition) return res.status(404).json({ error: "Audiobook edition not found" });

    if (!edition.pageTexts.some((pageText) => pageText.ttsAudios && pageText.ttsAudios.length > 0)) {
      return res.status(404).json({ error: "No TTS audio found for this edition and voice" });
    }

    const pageTextMap = new Map(edition.pageTexts.map((pageText) => [pageText.id, pageText]));

    const pages = await Promise.all(
      edition.pages.map(async (page) => {
        const layout = await Promise.all(
          // fetch tts audio and transcript for each text item
          (page.layout as CanvasItem[]).map(async (item) => {
            if (item.type !== "text") return item;

            const pageText = pageTextMap.get(item.originalTextId);
            if (!pageText) return item;

            const pageTts = pageText.ttsAudios[0];

            const bucket = Buckets.TTS_AUDIO_BUCKET;
            const fileName = `${pageText.id}.mp3`;
            const key = `${edition.id}/${pageTts.ttsVoiceId}/${fileName}`;
            const audioUrl = await getSignedUrl(bucket, key, fileName);

            return {
              ...item,
              audioUrl,
              transcript: pageTts.transcript,
            };
          })
        );

        return {
          id: page.id,
          items: layout,
        };
      })
    );

    let coverPageUrl;
    const coverPage = await prisma.audioBookCover.findFirst({
      where: { audioBookEditionId: edition.id },
    });

    if (coverPage) {
      coverPageUrl = await getCoverImageSignedUrl(edition.id, coverPage.id);
    }

    const result = {
      id: edition.id,
      title: edition.audioBook.title,
      coverPageUrl,
      pages,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching edition pages:", error);
    res.status(500).json({ error: "Failed to fetch edition pages" });
  }
};

export const createEdition = async (req: Request, res: Response) => {
  try {
    const edition = await prisma.audioBookEdition.create({
      data: { ...req.body, userId: req.user!.userId },
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

export const updatePagesForEdition = async (req: Request, res: Response) => {
  // URL 파라미터에서 editionId를 가져옵니다.
  const { editionId } = req.params;

  // 요청 본문(body)에서 프론트엔드로부터 받은 페이지 배열을 가져옵니다.
  const pagesFromClient = req.body;
  // --- 유효성 검사 ---
  if (!editionId) {
    console.log("Edition ID is required in URL parameter.");
    return res.status(400).json({ error: "Edition ID is required in URL parameter." });
  }
  if (!Array.isArray(pagesFromClient)) {
    console.log("Request body must be an array of pages.");
    return res.status(400).json({ error: "Request body must be an array of pages." });
  }

  try {
    // 중간에 하나라도 실패하면 모든 작업이 롤백
    await prisma.$transaction(async (tx) => {
      // 1. 클라이언트로부터 받은 모든 페이지를 Upsert (Update or Insert)
      await Promise.all(
        pagesFromClient.map((page, index) => {
          const pageData = {
            id: page.id,
            audioBookEditionId: editionId,
            order: index + 1,
            layout: page.items,
            userId: req.user!.userId,
          };

          return tx.audioBookPage.upsert({
            where: { id: page.id }, // 이 ID를 가진 페이지가 있으면
            update: {
              // 이 데이터로 업데이트하고
              order: pageData.order,
              layout: pageData.layout,
            },
            create: pageData, // 없으면 이 데이터로 생성
          });
        })
      );

      // 2. DB에는 있지만 클라이언트가 보낸 목록에는 없는 페이지를 삭제
      // (예: 사용자가 프론트엔드에서 페이지를 삭제한 경우)
      const pageIdsFromClient = pagesFromClient.map((p) => p.id);

      await tx.audioBookPage.deleteMany({
        where: {
          audioBookEditionId: editionId,
          id: {
            notIn: pageIdsFromClient, // 클라이언트가 보낸 ID 목록에 없는 것들
          },
        },
      });
    });

    // 모든 작업이 성공적으로 완료됨
    res.status(200).json({ message: "Pages saved successfully." });
  } catch (error) {
    console.error("Failed to save pages:", error);
    res.status(500).json({ error: "An error occurred while saving the pages." });
  }
};
