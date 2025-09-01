-- DropForeignKey
-- ALTER TABLE "public"."AudioBookPageImage" DROP CONSTRAINT "AudioBookPageImage_pageId_fkey";

-- CreateTable
CREATE TABLE "public"."AudioBookEditionImage" (
    "id" UUID NOT NULL,
    "audioBookEditionId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookEditionImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AudioBookEditionImage" ADD CONSTRAINT "AudioBookEditionImage_audioBookEditionId_fkey" FOREIGN KEY ("audioBookEditionId") REFERENCES "public"."AudioBookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
