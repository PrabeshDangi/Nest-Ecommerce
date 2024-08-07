/*
  Warnings:

  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `picture` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductTags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `availability` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountprice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnpolicy` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Size" AS ENUM ('sm', 'm', 'l', 'xl', 'xxl');

-- DropForeignKey
ALTER TABLE "_ProductTags" DROP CONSTRAINT "_ProductTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductTags" DROP CONSTRAINT "_ProductTags_B_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "name",
DROP COLUMN "picture",
ADD COLUMN     "availability" BOOLEAN NOT NULL,
ADD COLUMN     "brand" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "discountprice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discounttag" BOOLEAN,
ADD COLUMN     "image" TEXT[],
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "returnpolicy" TEXT NOT NULL,
ADD COLUMN     "sizes" "Size",
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_ProductTags";
