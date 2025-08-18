-- DropForeignKey
ALTER TABLE "AudioBookPageText" DROP CONSTRAINT "AudioBookPageText_pageId_fkey";

-- AddForeignKey
ALTER TABLE "AudioBookPageText" ADD CONSTRAINT "AudioBookPageText_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "AudioBookPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
