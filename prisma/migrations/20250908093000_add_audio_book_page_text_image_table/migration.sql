-- CreateTable
CREATE TABLE "AudioBookPageTextImage" (
    "id" UUID NOT NULL,
    "pageTextId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID,

    CONSTRAINT "AudioBookPageTextImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AudioBookPageTextImage" ADD CONSTRAINT "AudioBookPageTextImage_pageTextId_fkey" FOREIGN KEY ("pageTextId") REFERENCES "AudioBookPageText"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageTextImage" ADD CONSTRAINT "AudioBookPageTextImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;


