import { Request, Response } from "express";
import { prisma } from "../../prisma";
import { generateTtsVoice } from "../../services/btob";
import { ApiStatus } from "../../constants/apiStatus";

export const getAllVoices = async (req: Request, res: Response) => {
  try {
    const voices = await prisma.ttsVoice.findMany({ orderBy: { createdAt: "desc" } });
    res.status(200).json(voices);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getAllVoicesWithReadyStatus = async (req: Request, res: Response) => {
  const { editionId } = req.query;

  if (!editionId) {
    return res.status(400).json({ error: "editionId is required" });
  }

  try {
    const voices = await prisma.ttsVoice.findMany({
      where: {
        OR: [{ userId: req.user?.userId }, { userId: null }],
      },
      include: {
        ttsAudios: {
          where: {
            audioBookPageText: {
              audioBookEdition: {
                id: editionId as string,
              },
            },
          },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // remove unused data
    const cleanedVoices = voices.map(({ ttsAudios, ...voice }) => ({
      ...voice,
      isReady: ttsAudios.length > 0,
    }));

    // move ready voices to front of list
    cleanedVoices.sort((a, b) => {
      if (a.isReady === b.isReady) return 0;
      return b.isReady ? 1 : -1;
    });

    res.status(200).json(cleanedVoices);
  } catch (error) {
    res.status(500).json({});
  }
};

export const getVoiceById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const voice = await prisma.ttsVoice.findUnique({
      where: { id },
    });
    if (!voice) return res.status(404).json({ error: "Voice not found" });
    res.status(200).json(voice);
  } catch (error) {
    res.status(500).json({});
  }
};

export const createVoice = async (req: Request, res: Response) => {
  try {
    const {
      modelName,
      displayImage,
      displayColor,
    }: {
      modelName: string;
      displayImage?: string;
      displayColor?: string;
    } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || !modelName) return res.status(400).json({ error: "Missing required fields" });

    const apiResponse = await generateTtsVoice(files, modelName);
    if (apiResponse.error) return res.status(500).json({ error: apiResponse.error });

    const randomHue = Math.floor(Math.random() * 255);
    const randomColor = `hsl(${randomHue}, 100%, 75%)`;

    const voice = await prisma.ttsVoice.create({
      data: {
        modelId: apiResponse.data,
        modelName,
        displayName: modelName,
        displayImage,
        displayColor: randomColor,
        status: ApiStatus.COMPLETE,
        userId: req.user!.userId,
      },
    });
    res.status(201).json(voice);
  } catch (error) {
    console.error("Error creating voice:", error);
    res.status(500).json({ error: "Failed to create voice" });
  }
};

export const updateVoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const voice = await prisma.ttsVoice.update({
      where: { id },
      data: { ...req.body },
    });
    res.status(200).json(voice);
  } catch (error) {
    res.status(500).json({});
  }
};

export const deleteVoice = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.ttsVoice.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({});
  }
};
