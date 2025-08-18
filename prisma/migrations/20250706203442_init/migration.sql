-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBook" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookEdition" (
    "id" UUID NOT NULL,
    "audioBookId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookEdition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookPage" (
    "id" UUID NOT NULL,
    "audioBookEditionId" UUID NOT NULL,
    "pageNum" INTEGER NOT NULL,
    "layoutType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookPageImage" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "AudioBookPageImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookPageText" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "AudioBookPageText_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookPageTts" (
    "id" UUID NOT NULL,
    "pageId" UUID NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "wordTimings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookPageTts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookCover" (
    "id" UUID NOT NULL,
    "audioBookEditionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookCover_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioBookCoverElement" (
    "id" UUID NOT NULL,
    "coverId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "fontSize" INTEGER,
    "fontColor" TEXT,
    "fontFamily" TEXT,
    "zIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioBookCoverElement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AudioBookPageTts_pageId_key" ON "AudioBookPageTts"("pageId");

-- CreateIndex
CREATE UNIQUE INDEX "AudioBookCover_audioBookEditionId_key" ON "AudioBookCover"("audioBookEditionId");

-- AddForeignKey
ALTER TABLE "AudioBookEdition" ADD CONSTRAINT "AudioBookEdition_audioBookId_fkey" FOREIGN KEY ("audioBookId") REFERENCES "AudioBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPage" ADD CONSTRAINT "AudioBookPage_audioBookEditionId_fkey" FOREIGN KEY ("audioBookEditionId") REFERENCES "AudioBookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageImage" ADD CONSTRAINT "AudioBookPageImage_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "AudioBookPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageText" ADD CONSTRAINT "AudioBookPageText_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "AudioBookPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookPageTts" ADD CONSTRAINT "AudioBookPageTts_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "AudioBookPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCover" ADD CONSTRAINT "AudioBookCover_audioBookEditionId_fkey" FOREIGN KEY ("audioBookEditionId") REFERENCES "AudioBookEdition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioBookCoverElement" ADD CONSTRAINT "AudioBookCoverElement_coverId_fkey" FOREIGN KEY ("coverId") REFERENCES "AudioBookCover"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
