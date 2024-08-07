import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  for (let i = 0; i < 30; i++) {
    const name = faker.person.fullName();
    const email = faker.internet.email();
    const phone = faker.phone.number('+1##########'); 
    const password = await bcrypt.hash(faker.internet.password(7), saltRounds);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password,
      },
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
