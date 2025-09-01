/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `AudioBookPageTts` table. All the data in the column will be lost.
  - You are about to drop the column `pageId` on the `AudioBookPageTts` table. All the data in the column will be lost.
  - You are about to drop the column `wordTimings` on the `AudioBookPageTts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pageTextId,ttsVoiceId]` on the table `AudioBookPageTts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pageTextId` to the `AudioBookPageTts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transcript` to the `AudioBookPageTts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ttsVoiceId` to the `AudioBookPageTts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AudioBookPageTts" DROP CONSTRAINT "AudioBookPageTts_pageId_fkey";

-- DropIndex
DROP INDEX "AudioBookPageTts_pageId_key";

-- AlterTable
ALTER TABLE "AudioBookPageTts" DROP COLUMN "audioUrl",
DROP COLUMN "pageId",
DROP COLUMN "wordTimings",
ADD COLUMN     "pageTextId" UUID NOT NULL,
ADD COLUMN     "transcript" JSONB NOT NULL,
ADD COLUMN     "ttsVoiceId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AudioBookPageTts_pageTextId_ttsVoiceId_key" ON "AudioBookPageTts"("pageTextId", "ttsVoiceId");

-- AddForeignKey
ALTER TABLE "AudioBookPageTts" ADD CONSTRAINT "AudioBookPageTts_pageTextId_fkey" FOREIGN KEY ("pageTextId") REFERENCES "AudioBookPageText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageTts" ADD CONSTRAINT "AudioBookPageTts_ttsVoiceId_fkey" FOREIGN KEY ("ttsVoiceId") REFERENCES "TtsVoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
