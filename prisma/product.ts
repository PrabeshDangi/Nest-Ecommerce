import { faker, Randomizer } from '@faker-js/faker';
import { Product } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const sizes = ['sm', 'm', 'l', 'xl', 'xxl'];

let dummyProducts: Product[] = Array.from({ length: 100 }).map(() => ({
  id: faker.datatype.number(), // Assuming this is just for the dummy generation. Prisma will handle IDs automatically.
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  image: [faker.image.imageUrl(), faker.image.imageUrl()], // Generating an array of image URLs
  discounttag: faker.datatype.boolean(),
  rating: parseFloat(faker.datatype.float({ min: 1, max: 5 }).toFixed(1)),
  discountprice: faker.datatype.boolean()
    ? parseFloat(faker.commerce.price())
    : null,
  sizes: faker.datatype.boolean()
    ? (faker.helpers.arrayElement(sizes) as any)
    : null,
  returnpolicy: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  brand: faker.company.name(),
  availability: faker.datatype.boolean(),
  categories: [], // Assuming you will handle categories separately.
  Cart: [], // Assuming you will handle the cart separately.
  onSale: faker.datatype.boolean(),
  saleStart: faker.datatype.boolean() ? faker.date.future() : null,
  saleEnd: faker.datatype.boolean() ? faker.date.future() : null,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  Wishlist: [], // Assuming you will handle the wishlist separately.
  bannerId: null,
  banners: [], // Assuming you will handle banners separately.
  stock: faker.datatype.number({ min: 0, max: 100 }),
  soldqunatity: faker.datatype.number({ min: 0, max: 100 }),
  Flashitem: null,
  flashitemId: null,
}));

//console.log(dummyProducts);

async function main() {
  const categories = await prisma.category.findMany();

  for (const product of dummyProducts) {
    //console.log(product.sizes);
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
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
          connect: { id: randomCategory.id },
        },
      },
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
