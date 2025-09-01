/*
  Warnings:

  - You are about to drop the column `layoutType` on the `AudioBookPage` table. All the data in the column will be lost.
  - You are about to drop the column `pageNum` on the `AudioBookPage` table. All the data in the column will be lost.
  - You are about to drop the column `pageId` on the `AudioBookPageText` table. All the data in the column will be lost.
  - Added the required column `layout` to the `AudioBookPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `AudioBookPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AudioBookPage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audioBookEditionId` to the `AudioBookPageText` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AudioBookPageImage" DROP CONSTRAINT "AudioBookPageImage_pageId_fkey";

-- DropForeignKey
ALTER TABLE "AudioBookPageText" DROP CONSTRAINT "AudioBookPageText_pageId_fkey";

-- AlterTable
ALTER TABLE "AudioBookPage" DROP COLUMN "layoutType",
DROP COLUMN "pageNum",
ADD COLUMN     "layout" JSONB NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AudioBookPageText" DROP COLUMN "pageId",
ADD COLUMN     "audioBookEditionId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "AudioBookPageText" ADD CONSTRAINT "AudioBookPageText_audioBookEditionId_fkey" FOREIGN KEY ("audioBookEditionId") REFERENCES "AudioBookEdition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
