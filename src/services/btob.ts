import axios from "axios";
import FormData from "form-data";

const client = axios.create({
  baseURL: process.env.BTOB_API_URL,
  headers: {
    "X-API-KEY": process.env.BTOB_API_KEY,
    "Content-Type": "application/json",
  },
});

export const generateTtsVoice = async (files: Express.Multer.File[], modelName: string) => {
  const formData = new FormData();
  formData.append("modelName", modelName);
  files.forEach((file) => {
    formData.append("files", file.buffer, { filename: file.originalname });
  });
  const response = await client.post("/tts/models/generate-model", formData, {
    headers: formData.getHeaders(),
  });
  return response.data;
};

export const checkGrammar = async (text: string) => {
  const response = await client.post("/story/grammar/check-grammar", { text });
  return response.data;
};

interface TtsResponseData {
  transcription: {
    words: {
      word: string,
      startMs: number,
      endMs: number,
    }[]
  },
  audioUrl: string;
}

export const generateTtsAudio = async (ttsModelId: string, text: string): Promise<TtsResponseData> => {
  const response = await client.post('/story/tts-transcription', { ttsModelId, text });
  return response.data.data;
};
export const generateCharacters = async (storyText: string) => {
  const { data } = await client.post("/story/character/generate-characters", {
    story_text: storyText,
  });
  return data as {
    characters: {
      id: string;
      name: string;
      description: string;
      image_url: string;
      token_usage?: any;
      cost?: number;
    }[];
  };
};

export const generateSceneWithTools = async (
  sceneDescription: string,
  characterUids: string[],
  ratio: string = "16:9",
) => {
  const { data } = await client.post("/story/scene/generate-scene-with-tools", {
    scene_description: sceneDescription,
    character_uids: characterUids,
    ratio,
  });
  return data as {
    id: string;
    scene_description: string;
    scene_image_url?: string;
    character_references?: Record<string, string>;
    style_used?: any;
    token_usage?: any;
    cost?: number;
  };
};