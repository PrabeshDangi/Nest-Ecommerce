/*
  Warnings:

  - Added the required column `minPurchaseAmount` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "minPurchaseAmount" DOUBLE PRECISION NOT NULL;
