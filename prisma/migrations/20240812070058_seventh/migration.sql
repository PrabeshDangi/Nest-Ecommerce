/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_userId_productId_key" ON "Wishlist"("userId", "productId");

CREATE INDEX "user_fulltext_idx" ON "User" USING GIN (
  to_tsvector('english', "name")
);