import { faker } from '@faker-js/faker';

const sizes = ['sm', 'm', 'l', 'xl', 'xxl'];

export const dummyProducts = Array.from({ length: 100 }).map(() => ({
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  image: [faker.image.imageUrl(), faker.image.imageUrl()],
  discounttag: faker.datatype.boolean() ? faker.datatype.boolean() : null,
  discountprice: faker.datatype.boolean()
    ? parseFloat(faker.commerce.price())
    : null,
  sizes: faker.datatype.boolean() ? faker.helpers.arrayElement(sizes) : null,
  returnpolicy: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  brand: faker.company.name(),
  availability: faker.datatype.boolean(),
  onSale: faker.datatype.boolean(),
  soldquantity: faker.datatype.boolean()
    ? faker.datatype.number({ min: 0, max: 100 })
    : null,
  stock: faker.datatype.number({ min: 0, max: 100 }),
  bannerId: null,
  flashitemId: null,
}));
