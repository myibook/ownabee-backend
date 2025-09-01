import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { generateTtsAudio } from "../../services/btob";
import { uploadTtsAudioToS3 } from "../../utils/pageTts";
import pLimit from "p-limit";

export const getAllPageTts = async (req: Request, res: Response) => {
  try {
    const pageTts = await prisma.audioBookPageTts.findMany();
    res.status(200).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getPageTtsById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageTts = await prisma.audioBookPageTts.findUnique({ where: { id } });
    if (!pageTts) return res.status(404).json({ error: "Audiobook pageTtss not found" });
    res.status(200).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createPageTts = async (req: Request, res: Response) => {
  try {
    const pageTts = await prisma.audioBookPageTts.create({
      data: { ...req.body, userId: req.user!.userId },
    });
    res.status(201).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const generateTtsForEdition = async (req: Request, res: Response) => {
  try {
    const { editionId, ttsVoiceId } = req.body;

    if (!editionId || !ttsVoiceId) return res.status(400).json({ error: "Missing required fields" });

    // check for existing tts for chosen edition and voice
    const existingTts = await prisma.audioBookPageTts.findFirst({
      where: {
        ttsVoiceId,
        audioBookPageText: {
          audioBookEditionId: editionId,
        },
      },
    });

    if (existingTts) return res.status(409).json({ error: "TTS audio already exists for this edition and voice" });

    const voice = await prisma.ttsVoice.findUnique({ where: { id: ttsVoiceId } });
    if (!voice) return res.status(404).json({ error: "TTS voice not found" });

    const ttsModelId = voice.modelId;

    const edition = await prisma.audioBookEdition.findUnique({
      where: { id: editionId },
      include: {
        pageTexts: {
          select: {
            id: true,
            originalText: true,
            grammarCorrectedText: true,
            grammarChecked: true,
          },
        },
      },
    });

    if (!edition) return res.status(404).json({ error: "Audiobook edition not found" });

    const limit = pLimit(8);

    // generate tts for each text item in layout
    const ttsPromises = edition.pageTexts.map(({ id, originalText, grammarCorrectedText, grammarChecked }) =>
      limit(async () => {
        const text = grammarChecked ? grammarCorrectedText : originalText;
        const { transcription, audioUrl } = await generateTtsAudio(ttsModelId, text);

        const audioResponse = await fetch(audioUrl);
        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

        await uploadTtsAudioToS3(editionId, ttsVoiceId, id, audioBuffer);

        const pageTts = await prisma.audioBookPageTts.create({
          data: {
            transcript: transcription.words,
            pageTextId: id,
            ttsVoiceId,
            userId: req.user!.userId,
          },
        });
        return pageTts;
      })
    );

    const results = await Promise.all(ttsPromises);

    res.status(201).json(results);
  } catch (error) {
    console.error("Error creating TTS for audiobook edition:", error);
    res.status(500).json({ error: "Failed to generate TTS for audiobook edition" });
  }
};

export const updatePageTts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const pageTts = await prisma.audioBookPageTts.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(pageTts);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deletePageTts = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.audioBookPageTts.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
