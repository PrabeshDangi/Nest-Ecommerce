/*
  Warnings:

  - Added the required column `title` to the `Storycontent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Storycontent" ADD COLUMN     "title" TEXT NOT NULL;
