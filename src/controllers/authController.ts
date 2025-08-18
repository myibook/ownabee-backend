// src/controllers/authController.ts
import { Request, Response } from "express";
import axios from "axios";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI_MOBILE,
  APP_SCHEME,
} from "../config/constants";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { URL } from "url";
import { prisma } from "../prisma";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";
const JWKS = createRemoteJWKSet(new URL(GOOGLE_JWKS_URI));

// authorize API (Google OAuth 시작)
export const authorize = (req: Request, res: Response) => {
  const { client_id, redirect_uri, state } = req.query;

  if (!client_id || !redirect_uri)
    return res.status(400).json({ error: "Missing client_id or redirect_uri" });

  let idpClientId: string;

  // redirect_uri가 모바일 앱 스킴과 일치하는지 확인
  if (redirect_uri !== APP_SCHEME) {
    return res.status(400).json({
      error: "Invalid redirect_uri. Only mobile app scheme is supported.",
    });
  }

  // client_id가 'google'인지 확인
  if (client_id === "google") {
    idpClientId = GOOGLE_CLIENT_ID;
  } else {
    return res
      .status(400)
      .json({ error: 'Invalid client. Only "google" is supported.' });
  }

  // state에 platform 정보 포함 (현재는 항상 'mobile')
  const combinedState = `mobile|${state || ""}`;

  const params = new URLSearchParams({
    client_id: idpClientId,
    redirect_uri: "https://1d2c34fcef98.ngrok-free.app/api/auth/callback",
    response_type: "code",
    scope: "openid email profile",
    // access_type: "offline",
    prompt: "select_account",
    state: combinedState,
  });

  const googleAuthUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  return res.redirect(googleAuthUrl);
};

// callback API (Google OAuth 콜백)
export const callback = async (req: Request, res: Response) => {
  const { code, state: combinedState, error, error_description } = req.query;

  if (error) {
    console.error("OAuth callback error:", error, error_description);
    // 모바일 앱으로 오류 리다이렉트 (프론트엔드에서 처리)
    return res.redirect(
      `${APP_SCHEME}//callback?error=${error}&error_description=${error_description}`
    );
  }

  if (!code || !combinedState) {
    return res.status(400).json({ error: "Missing code or state" });
  }

  const [platform, originalState] = (combinedState as string).split("|");

  if (platform !== "mobile") {
    // 웹 플랫폼 관련 로직 제거
    return res
      .status(400)
      .json({ error: "Invalid platform in state. Only mobile is supported." });
  }

  try {
    const tokenResponse = await axios.post(
      GOOGLE_TOKEN_URL,
      new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI_MOBILE,
        grant_type: "authorization_code",
        code: code as string,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { id_token } = tokenResponse.data; // access_token, refresh_token (Google의 것)은 여기서는 사용하지 않음

    if (!id_token) {
      return res.status(400).json({ error: "Missing id_token from Google" });
    }

    interface GoogleIdTokenPayload {
      email: string;
      sub: string;
      name?: string;
      given_name?: string;
      picture?: string;
      [key: string]: any;
    }

    // ID Token 검증 및 사용자 정보 추출
    const payload = (await verifyGoogleIdToken(
      id_token
    )) as GoogleIdTokenPayload;
    const email = payload.email;
    const name = payload.name || payload.given_name;
    const sub = payload.sub;
    const picture = payload.picture || "";

    interface TokenPayload {
      userId: string;
      email: any;
      sub: string;
      picture?: string;
    }

    // 사용자 DB에 저장 또는 업데이트
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          sub,
          picture,
        },
      });
    }

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email!,
      sub: payload.sub!,
      picture: payload?.picture,
    };

    // JWT 생성 (내부 인증 토큰)
    const internalAccessToken = generateAccessToken(tokenPayload);
    const internalRefreshToken = generateRefreshToken(tokenPayload);

    // 모바일 앱으로 리다이렉트
    const mobileRedirectUrl = `${APP_SCHEME}//callback?accessToken=${internalAccessToken}&refreshToken=${internalRefreshToken}&state=${originalState}`;
    return res.redirect(mobileRedirectUrl);
  } catch (error) {
    console.error("Token exchange or user creation error:", error);
    // 오류 발생 시 모바일 앱으로 리다이렉트
    return res.redirect(
      `${APP_SCHEME}//callback?error=server_error&error_description=Failed to process Google OAuth callback`
    );
  }
};

// refresh API (토큰 갱신)
export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken: clientRefreshToken } = req.body;
  if (!clientRefreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  const decoded = verifyToken(clientRefreshToken);

  if (decoded === "expired" || !decoded) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  // 데이터베이스에서 사용자 존재 여부 확인 (선택 사항, 보안 강화)
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    return res
      .status(403)
      .json({ message: "User not found for refresh token" });
  }

  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
  };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload); // Refresh Token Rotation

  res
    .status(200)
    .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
};

// logout API
export const logout = (req: Request, res: Response) => {
  // 모바일 앱의 경우 클라이언트가 토큰을 삭제하도록 지시
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please clear tokens on client side.",
  });
};

/** Google의 JWK Set을 가져와 검증에 사용할 수 있는 key 집합 생성 */
const jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URI));

export const verifyGoogleIdToken = async (
  idToken: string
): Promise<JWTPayload> => {
  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: "https://accounts.google.com",
    audience: GOOGLE_CLIENT_ID,
  });
  return payload;
};
