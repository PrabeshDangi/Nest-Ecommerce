import {categories} from './category'
import { products } from './product'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.findMany();


  for (const product of products) {
   const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    await prisma.product.create({
      data: {
        title: product.title,
        price: product.price,
        image: product.image,
        discounttag: product.discounttag,
        rating: product.rating,
        discountprice: product.discountprice,
        sizes: product.sizes,
        returnpolicy: product.returnpolicy,
        description: product.description,
        brand: product.brand,
        availability: product.availability,
        categories: {
          connect: { id: randomCategory.id }
        }
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
