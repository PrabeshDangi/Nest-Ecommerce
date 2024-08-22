import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { UpdateFlashDto } from './dto/updateflash.dto';
import * as moment from 'moment';

@Injectable()
export class FlashsaleService {
  constructor(private prisma: PrismaService) {}

  async getAllFlashItems() {
    const currentDate = new Date();

    const onSaleItems = await this.prisma.product.findMany({
      where: {
        onSale: true,
        saleStart: {
          lte: currentDate, // Sale start is less than or equal to the current date
        },
        saleEnd: {
          gte: currentDate, // Sale end is greater than or equal to the current date
        },
      },
    });

    if (onSaleItems.length === 0) {
      throw new NotFoundException('No items found on sale!!');
    }

    return onSaleItems;
  }

  async addItemToFlash(
    id: number,
    updateflashdto: UpdateFlashDto,
    req: Request,
    res: Response,
  ) {
    const { saleStart, saleEnd, discountprice } = updateflashdto;

    if (saleStart > new Date()) {
      throw new BadRequestException(
        'sale start date should be greater than current date and time!!',
      );
    }

    if (saleEnd < saleStart) {
      throw new BadRequestException(
        'Sale start date must be smaller than the sale end date!!',
      );
    }

    const itemAvailable = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!itemAvailable) {
      throw new NotFoundException('Item not found!!');
    }

    if (itemAvailable.onSale) {
      throw new BadRequestException('Item is already on sale!');
    }

    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const saleItem = await this.prisma.product.update({
      where: {
        id: id,
      },
      data: {
        onSale: true,
        saleStart: saleStart,
        saleEnd: saleEnd,
        discountprice: discountprice,
      },
    });

    return res.status(201).json({
      message: 'Item added on flash sale!!',
      data: saleItem,
    });
  }

  async deleteItemFromFlash(id: number, req: any, res: any) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const item = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!(item && item.onSale)) {
      throw new NotFoundException('Item not found on sale!!');
    }

    // const originalPrice=await this.prisma.product.findUnique({
    //     where:{id},
    //     select:{
    //         price:true
    //     }
    // })

    await this.prisma.product.update({
      where: { id },

      data: {
        onSale: false,
        saleStart: null,
        saleEnd: null,
        discountprice: null,
      },
    });

    res.status(201).json({
      message: 'Item removed from flash successfully!!',
    });
  }
}
