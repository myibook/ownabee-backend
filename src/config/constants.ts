// src/config/constants.ts
import dotenv from "dotenv";
dotenv.config();

// 인증 관련 상수
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME;
export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
export const GOOGLE_REDIRECT_URI_MOBILE = process.env
  .GOOGLE_REDIRECT_URI_MOBILE as string;

export const APP_SCHEME = process.env.APP_SCHEME as string;

if (
  !JWT_SECRET ||
  !GOOGLE_CLIENT_ID ||
  !GOOGLE_CLIENT_SECRET ||
  !GOOGLE_REDIRECT_URI_MOBILE ||
  !APP_SCHEME
) {
  console.error(
    "Critical environment variables are missing. Please check your .env file."
  );
  process.exit(1);
}
