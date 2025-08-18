import express, { Request, Response } from "express";
import { prisma } from "./prisma";

import apiRoutes from "./routes/routes";
import authRoutes from "./routes/auth";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api", apiRoutes);

app.get("/health", (_req: Request, res: Response): void => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");

    const PORT = process.env.PORT || 80;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", (error as Error).message);
    process.exit(1);
  }
}

startServer();

export default app;
