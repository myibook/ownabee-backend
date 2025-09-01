/*
  Warnings:

  - Added the required column `components` to the `AudioBookCover` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioBookCover" ADD COLUMN     "components" JSONB NOT NULL;
