import { PrismaClient } from '@prisma/client';
import { categories } from 'prisma/category';
import { dummyProducts } from 'prisma/product';
import { Size } from 'src/common/enums/size.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function seed() {
  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category,
      },
    });
  }
  console.log('Categories seeded!!!');

  const hashedpassword = await bcrypt.hash('Testkumar12345', 10);
  await prisma.user.create({
    data: {
      name: 'Test Kumar',
      email: 'testkumar@gmail.com',
      phone: '98111111',
      password: hashedpassword,
    },
  });

  console.log('Admin data seeded!!');

  const categoriesFromDb = await prisma.category.findMany();

  for (const product of dummyProducts) {
    const randomCategory =
      categoriesFromDb[Math.floor(Math.random() * categoriesFromDb.length)];
    await prisma.product.create({
      data: {
        title: product.title,
        price: product.price,
        image: product.image,
        discounttag: false,
        discountprice: null,
        sizes: product.sizes as Size,
        returnpolicy: product.returnpolicy,
        description: product.description,
        brand: product.brand,
        availability: true,
        categories: {
          connect: { id: randomCategory.id },
        },
      },
    });
  }
  console.log('Products seeded');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
