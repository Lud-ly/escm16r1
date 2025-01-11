-- AlterTable
ALTER TABLE "ClubResult" 
ADD COLUMN "goalsScored" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "goalsConceded" INTEGER NOT NULL DEFAULT 0;

-- Update existing rows (optional, only if you want to set specific values)
-- UPDATE "ClubResult" SET "goalsScored" = 0, "goalsConceded" = 0;

-- Remove the default constraint after updating
ALTER TABLE "ClubResult" ALTER COLUMN "goalsScored" DROP DEFAULT;
ALTER TABLE "ClubResult" ALTER COLUMN "goalsConceded" DROP DEFAULT;