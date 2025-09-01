-- Add characterGenerationStatus column to AudioBookEdition
ALTER TABLE "AudioBookEdition"
ADD COLUMN IF NOT EXISTS "characterGenerationStatus" TEXT NOT NULL DEFAULT 'NULL';
