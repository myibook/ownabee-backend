import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { generateCharacters, generateSceneWithTools } from "../../services/btob";

// Generate character IDs from entire story text or from an AudioBookEdition's texts
export const generateCharactersForEdition = async (req: Request, res: Response) => {
  try {
    const { storyText, audioBookEditionId } = req.body as {
      storyText?: string;
      audioBookEditionId?: string;
    };

    let fullText = storyText?.trim();
    if (!fullText && audioBookEditionId) {
      const texts = await prisma.audioBookPageText.findMany({
        where: { audioBookEditionId },
        orderBy: { order: "asc" },
      });
      fullText = texts
        .map((t) => (t.grammarCorrectedText?.trim() ? t.grammarCorrectedText : t.originalText))
        .filter(Boolean)
        .join("\n\n");
    }

    if (!fullText) {
      return res.status(400).json({ error: "storyText or audioBookEditionId is required" });
    }

    // 상태 표시: 요청 시작
    if (audioBookEditionId) {
      await prisma.audioBookEdition.update({
        where: { id: audioBookEditionId },
        data: { characterGenerationStatus: 'PENDING' },
      });
    }

    const charResp = await generateCharacters(fullText);
    const characters = (charResp.characters ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      image_url: c.image_url,
      token_usage: c.token_usage,
      cost: c.cost,
    }));
    const characterUids = characters.map((c) => c.id);

    // Persist to edition if provided (allow empty array to be saved)
    if (audioBookEditionId) {
      const args: any = {
        where: { id: audioBookEditionId },
        data: { characterUids, characterGenerationStatus: 'COMPLETE' },
      };
      await prisma.audioBookEdition.update(args);
    }

    return res.json({ characterUids, characters });
  } catch (err) {
    console.error("generateCharactersForEdition error:", err);
    // 실패 상태 기록
    try {
      const { audioBookEditionId } = req.body as { audioBookEditionId?: string };
      if (audioBookEditionId) {
        await prisma.audioBookEdition.update({
          where: { id: audioBookEditionId },
          data: { characterGenerationStatus: 'FAILED' },
        });
      }
    } catch {}
    return res.status(500).json({ error: "Failed to generate characters" });
  }
};

// Generate a scene image from character IDs and a scene description; optionally attach to page and/or edition
export const generateSceneImageWithCharacters = async (req: Request, res: Response) => {
  try {
    const { characterUids, prompt, attachToPageId, audioBookEditionId, ratio } = req.body as {
      characterUids?: string[];
      prompt?: string;
      attachToPageId?: string;
      audioBookEditionId?: string;
      ratio?: string;
    };

    if (!prompt?.trim()) {
      return res.status(400).json({ error: "prompt is required" });
    }

    let effectiveUids: string[] | undefined = characterUids;
    if ((!effectiveUids || effectiveUids.length === 0) && audioBookEditionId) {
      // 1) edition에 캐릭터가 이미 있으면 사용
      const edition = await prisma.audioBookEdition.findUnique({ where: { id: audioBookEditionId } });
      if (edition?.characterUids && edition.characterUids.length > 0) {
        effectiveUids = edition.characterUids;
      } else {
        // 2) 상태에 따라 처리: PENDING이면 완료까지 대기, idle/failed이면 새로 생성 트리거
        if (edition?.characterGenerationStatus === 'PENDING') {
          // 최대 20초 폴링 (500ms 간격)
          const maxWaitMs = 20000;
          const start = Date.now();
          while (Date.now() - start < maxWaitMs) {
            await new Promise(r => setTimeout(r, 500));
            const fresh = await prisma.audioBookEdition.findUnique({ where: { id: audioBookEditionId } });
            if (fresh?.characterUids && fresh.characterUids.length > 0 && fresh.characterGenerationStatus === 'COMPLETE') {
              effectiveUids = fresh.characterUids;
              break;
            }
          }
        }
        if (!effectiveUids || effectiveUids.length === 0) {
          // 생성 트리거 (동시에 이미 백그라운드가 완료될 수 있으니 레이스 조건 대비)
          try {
            await prisma.audioBookEdition.update({
              where: { id: audioBookEditionId },
              data: { characterGenerationStatus: 'PENDING' },
            });
          } catch {}
          const texts = await prisma.audioBookPageText.findMany({
            where: { audioBookEditionId },
            orderBy: { order: 'asc' },
          });
          const fullText = texts
            .map(t => (t.grammarCorrectedText?.trim() ? t.grammarCorrectedText : t.originalText))
            .filter(Boolean)
            .join("\n\n");
          try {
            const charResp = await generateCharacters(fullText);
            const uids = (charResp.characters ?? []).map((c: any) => c.id);
            // 레이스 처리: 생성 직후 최신 상태를 확인해 이미 완료된 캐릭터가 있으면 그걸 우선 사용
            const freshAfter = await prisma.audioBookEdition.findUnique({ where: { id: audioBookEditionId } });
            if (freshAfter?.characterUids && freshAfter.characterUids.length > 0 && freshAfter.characterGenerationStatus === 'COMPLETE') {
              effectiveUids = freshAfter.characterUids;
            } else {
              await prisma.audioBookEdition.update({
                where: { id: audioBookEditionId },
                data: { characterUids: uids, characterGenerationStatus: 'COMPLETE' },
              });
              effectiveUids = uids;
            }
          } catch {
            await prisma.audioBookEdition.update({
              where: { id: audioBookEditionId },
              data: { characterGenerationStatus: 'FAILED' } as any,
            });
          }
        }
      }
    }

    if (!Array.isArray(effectiveUids)) {
      return res.status(400).json({ error: "characterUids must be an array" });
    }

    const scene = await generateSceneWithTools(prompt.trim(), effectiveUids, ratio ?? "16:9");
    const sceneUrl = scene.scene_image_url;
    if (!sceneUrl) {
      return res.status(502).json({ error: "No scene_image_url in response." });
    }

    let pageImageId: string | undefined;
    if (attachToPageId) {
      const count = await prisma.audioBookPageImage.count({ where: { pageId: attachToPageId } });
      const img = await prisma.audioBookPageImage.create({
        data: { pageId: attachToPageId, url: sceneUrl, order: count + 1 },
      });
      pageImageId = img.id;
    }

    let editionImageId: string | undefined;
    if (audioBookEditionId) {
      const count = await prisma.audioBookEditionImage.count({
        where: { audioBookEditionId },
      });
      const img = await prisma.audioBookEditionImage.create({
        data: { audioBookEditionId, url: sceneUrl, order: count + 1 },
      });
      editionImageId = img.id;
    }

    return res.json({
      sceneImageUrl: sceneUrl,
      pageImageId,
      editionImageId,
      btbMeta: { token_usage: scene.token_usage, cost: scene.cost },
    });
  } catch (err) {
    console.error("generateSceneImageWithCharacters error:", err);
    return res.status(500).json({ error: "Failed to generate scene image" });
  }
};

// Fetch saved images for an AudioBookEdition
export const getEditionImages = async (req: Request, res: Response) => {
  try {
    const { editionId } = req.params as { editionId: string };
    if (!editionId) return res.status(400).json({ error: "editionId is required" });
    const images = await prisma.audioBookEditionImage.findMany({
      where: { audioBookEditionId: editionId },
      orderBy: { createdAt: "desc" },
    });
    return res.json(images);
  } catch (err) {
    console.error("getEditionImages error:", err);
    return res.status(500).json({ error: "Failed to fetch images" });
  }
};