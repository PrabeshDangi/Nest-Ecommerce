-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_bannerId_fkey";

-- CreateTable
CREATE TABLE "_BannerProducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BannerProducts_AB_unique" ON "_BannerProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_BannerProducts_B_index" ON "_BannerProducts"("B");

-- AddForeignKey
ALTER TABLE "_BannerProducts" ADD CONSTRAINT "_BannerProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BannerProducts" ADD CONSTRAINT "_BannerProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
