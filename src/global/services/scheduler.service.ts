// sale.scheduler.ts
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleScheduler {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleExpiredSales() {
    const now = new Date();

    await this.prisma.product.updateMany({
      where: {
        onSale: true,
        saleEnd: { lt: now },
      },

      data: {
        onSale: false,
        saleStart: null,
        saleEnd: null,
        discountprice: null,
      },
    });
  }
}
