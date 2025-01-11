-- CreateTable
CREATE TABLE "ClubResult" (
    "id" SERIAL NOT NULL,
    "clubId" TEXT NOT NULL,
    "wonGamesCount" INTEGER NOT NULL,
    "drawGamesCount" INTEGER NOT NULL,
    "lostGamesCount" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClubResult_pkey" PRIMARY KEY ("id")
);
