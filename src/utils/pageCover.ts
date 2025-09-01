import { Buckets } from "../constants/app";
import { getSignedUrl, putObject } from "../services/aws";

export const uploadCoverImageToS3 = async (editionId: string, coverImageId: string, buffer: Buffer) => {
  const bucket = Buckets.OWNABEE;
  const key = `${editionId}/${coverImageId}/cover.png`;
  return putObject(bucket, key, buffer);
};

export const getCoverImageSignedUrl = (editionId: string, coverImageId: string) => {
  return getSignedUrl(Buckets.OWNABEE, `${editionId}/${coverImageId}/cover.png`, "cover.png");
};
