import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categories = [
  "Women's Fashion",
  "Men's Fashion",
  "Sports",
  "Toys & Games",
  "Books",
  "Beauty & Personal Care",
  "Furniture",
  "Groceries",
  "Outdoor Gear",
  "Home Appliances",
  "Health & Fitness",
  "Electronics",
  "Home Decor",
  "Gaming",
  "Kitchen Appliances",
  "Watches",
  "Kitchenware",
  "Accessories",
  "Bags",
  "Fitness",
  "Health & Beauty",
  "Footwear",
  "Apparel"
];

async function main() {
  for (const category of categories) {
    const existingCategory = await prisma.category.findFirst({
      where:{ name: category },
    });

    if (!existingCategory) {
      await prisma.category.create({
        data: { name: category },
      });
    }
  }

  console.log('Categories seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
