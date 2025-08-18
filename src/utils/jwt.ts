import {
  JWT_SECRET,
  JWT_EXPIRATION_TIME,
  REFRESH_TOKEN_EXPIRY,
} from "../config/constants";
import * as jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION_TIME as any,
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY as any,
  });
};

export const verifyToken = (token: string): TokenPayload | "expired" | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      console.warn("🔁 Token expired");
      return "expired";
    }
    console.error("Token verification error:", error);
    return null;
  }
};
