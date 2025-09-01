import { Buckets } from "../constants/app";
import { putObject } from "../services/aws";

export const uploadTtsAudioToS3 = async (
  editionId: string,
  ttsVoiceId: string,
  pageTextId: string,
  buffer: Buffer
) => {
  const bucket = Buckets.TTS_AUDIO_BUCKET;
  const key = `${editionId}/${ttsVoiceId}/${pageTextId}.mp3`;
  return await putObject(bucket, key, buffer);
}