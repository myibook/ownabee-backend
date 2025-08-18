// src/routes/authRoutes.ts
import express, { RequestHandler } from "express";
import {
  callback,
  refreshToken,
  logout,
  authorize,
} from "../controllers/authController";

const router = express.Router();

// Google OAuth 관련
router.get("/authorize", authorize as RequestHandler);
router.get("/callback", callback as RequestHandler);
// 토큰 갱신
router.post("/refresh", refreshToken as RequestHandler);
// 로그아웃
router.post("/logout", logout);

export default router;
