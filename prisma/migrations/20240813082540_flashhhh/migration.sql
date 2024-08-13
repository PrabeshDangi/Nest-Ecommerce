/*
  Warnings:

  - You are about to drop the column `falshsale` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "falshsale",
ADD COLUMN     "onSale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "saleEnd" TIMESTAMP(3),
ADD COLUMN     "saleStart" TIMESTAMP(3);
