/*
  Warnings:

  - You are about to drop the column `text` on the `AudioBookPageText` table. All the data in the column will be lost.
  - Added the required column `grammarChecked` to the `AudioBookPageText` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grammarCorrectedText` to the `AudioBookPageText` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalText` to the `AudioBookPageText` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioBookPageText" DROP COLUMN "text",
ADD COLUMN     "grammarChecked" BOOLEAN NOT NULL,
ADD COLUMN     "grammarCorrectedText" TEXT NOT NULL,
ADD COLUMN     "originalText" TEXT NOT NULL;
