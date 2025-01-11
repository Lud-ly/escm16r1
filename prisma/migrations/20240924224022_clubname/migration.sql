/*
  Warnings:

  - Added the required column `clubName` to the `ClubResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClubResult" ADD COLUMN     "clubName" TEXT NOT NULL;
