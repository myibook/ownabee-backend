-- Add optional UUID[] column characterUids to AudioBookEdition
ALTER TABLE "AudioBookEdition"
ADD COLUMN "characterUids" UUID[] NOT NULL DEFAULT ARRAY[]::UUID[];


