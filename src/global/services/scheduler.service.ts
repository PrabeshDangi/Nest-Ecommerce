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

    const productIds = [];

    for (const flashItem of expiredFlashItems) {
      await this.prisma.$transaction(async (prisma) => {
        const disconnectedProducts = flashItem.products.map((product) => ({
          id: product.id,
        }));

        await prisma.flashitem.update({
          where: { id: flashItem.id },
          data: {
            products: {
              disconnect: disconnectedProducts,
            },
          },
        });

        productIds.push(...disconnectedProducts.map((product) => product.id));
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

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleExpiredCoupon() {
    const now = new Date();

    const expiredCoupon = await this.prisma.coupon.findMany({
      where: {
        expirationDate: { lt: now },
      },
    });

    for (const element of expiredCoupon) {
      await this.prisma.coupon.update({
        where: { id: element.id },
        data: {
          isActive: false,
        },
      });
    }
  }
}
