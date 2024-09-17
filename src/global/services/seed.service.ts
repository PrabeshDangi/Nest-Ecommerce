// import { Injectable, OnModuleInit } from '@nestjs/common'
// import { PrismaClient } from '@prisma/client'
// import { categories } from 'prisma/category'
// import { dummyProducts } from 'prisma/product'

// @Injectable()
// class SeedService implements OnModuleInit {
//   private prisma = new PrismaClient();
//   async onModuleInit() {
//     const isDatabaseEmpty = await this.checkIfDatabaseIsEmpty();
//     if (isDatabaseEmpty) {

//       await this.seedDatabase();
//     } else {
//       console.log('Skipping seeding!!');
//     }
//   }

//   private async checkIfDatabaseIsEmpty(): Promise<boolean> {
//     const categoryCount = await this.prisma.category.count();
//     const productCount = await this.prisma.product.count();
//     return categoryCount === 0 && productCount === 0;
//   }

//   private async seedDatabase() {
//     await this.seedCategories();
//     await this.seedProducts();
//   }

//   private async seedCategories() {
//     for (const category of categories) {
//       await this.prisma.category.create({
//         data: {
//           name: category,
//         },
//       });
//     }
//     console.log('Categories seeded!!!');
//   }

//   private async seedProducts() {
//     const categoriesFromDb = await this.prisma.category.findMany();

//     for (const product of dummyProducts) {
//       const randomCategory =
//         categoriesFromDb[Math.floor(Math.random() * categoriesFromDb.length)];
//       await this.prisma.product.create({
//         data: {
//           title: product.title,
//           price: product.price,
//           image: product.image,
//           discounttag: product.discounttag,
//           discountprice: product.discountprice,
//           sizes: product.sizes as Size,
//           returnpolicy: product.returnpolicy,
//           description: product.description,
//           brand: product.brand,
//           availability: product.availability,
//           categories: {
//             connect: { id: randomCategory.id },
//           },
//         },
//       });
//     }
//     console.log('Products seeded');
//   }
// }