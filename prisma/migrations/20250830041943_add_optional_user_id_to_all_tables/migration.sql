-- AlterTable
ALTER TABLE "AudioBook" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookCover" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookCoverElement" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookEdition" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookPage" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookPageImage" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookPageText" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "AudioBookPageTts" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "TtsVoice" ADD COLUMN     "userId" UUID;

-- AddForeignKey
ALTER TABLE "AudioBook" ADD CONSTRAINT "AudioBook_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookEdition" ADD CONSTRAINT "AudioBookEdition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPage" ADD CONSTRAINT "AudioBookPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageImage" ADD CONSTRAINT "AudioBookPageImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageText" ADD CONSTRAINT "AudioBookPageText_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageTts" ADD CONSTRAINT "AudioBookPageTts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCover" ADD CONSTRAINT "AudioBookCover_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCoverElement" ADD CONSTRAINT "AudioBookCoverElement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TtsVoice" ADD CONSTRAINT "TtsVoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
