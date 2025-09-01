/*
  Warnings:

  - A unique constraint covering the columns `[sub]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "TtsVoice" (
    "id" UUID NOT NULL,
    "modelId" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "displayImage" TEXT,
    "displayColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TtsVoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_sub_key" ON "User"("sub");
