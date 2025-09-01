import { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as s3GetUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const putObject = async (Bucket: string, Key: string, Body: any) => {
  return s3Client.send(new PutObjectCommand({ Bucket, Body, Key }));
};

export const getObjectList = async (Bucket: string, Prefix: string) => {
  return s3Client.send(new ListObjectsV2Command({ Bucket, Prefix }));
};

export const getSignedUrl = async (Bucket: any, Key: any, filename: string) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition: `attachment; filename="${encodeURI(filename)}"`,
  });
  return s3GetUrl(s3Client, command, { expiresIn: 604800 });
};
