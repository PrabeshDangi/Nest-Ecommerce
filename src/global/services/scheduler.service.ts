// sale.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleScheduler {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleExpiredSales() {
    const now = new Date();
    const expiredFlashItems = await this.prisma.flashitem.findMany({
      where: {
        saleEnd: {
          lt: now,
        },
      },
      include: {
        products: true,
      },
    });

    const productIds = expiredFlashItems.flatMap((flashItem) =>
      flashItem.products.map((product) => product.id),
    );

    for (const flashItem of expiredFlashItems) {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.flashitem.update({
          where: { id: flashItem.id },
          data: {
            saleEnd: null,
            saleStart: null,
            products: {
              disconnect: flashItem.products.map((product) => ({
                id: product.id,
              })),
            },
          },
        });
      });
    }

    if (productIds.length > 0) {
      await this.prisma.product.updateMany({
        where: {
          id: {
            in: productIds,
          },
        },
        data: {
          onSale: false,
        },
      });
    }
  }
}
