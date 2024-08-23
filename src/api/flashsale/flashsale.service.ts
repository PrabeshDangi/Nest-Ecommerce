import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { addFlashDto } from './dto/addItem.dto';

@Injectable()
export class FlashsaleService {
  constructor(private prisma: PrismaService) {}

  async getAllFlashItems() {
    const flashItems = await this.prisma.flashitem.findMany({
      select: {
        products: true,
      },
    });

    if (flashItems.length === 0) {
      return { message: 'No items found on flashsale at the moment!!' };
    }

    const products = flashItems.flatMap((flashItem) => flashItem.products);

    return { message: 'Flash items fetched successfully', data: products };
  }

  async addItemToFlash(addflashdto: addFlashDto, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const { saleStart, saleEnd, products } = addflashdto;

    if (saleStart.getDay() < new Date().getDay()) {
      throw new BadRequestException(
        'sale start date should be greater than current date and time!!',
      );
    }

    if (saleEnd < saleStart) {
      throw new BadRequestException(
        'Sale start date must be smaller than the sale end date!!',
      );
    }

    const availableProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: products,
        },
      },
    });

    if (!availableProducts) {
      throw new NotFoundException('Item not found on product list!!');
    }

    const flashAvailable = await this.prisma.flashitem.findFirst();

    if (!flashAvailable) {
      await this.prisma.flashitem.create({
        data: {
          saleStart,
          saleEnd,
          products: {
            connect: availableProducts.map((product) => ({ id: product.id })),
          },
        },
      });
      return res.status(200).json({
        message: 'Item added to the flash!!!',
      });
    }

    const itemAlreadyAdded = await this.prisma.flashitem.findFirst({
      where: {
        products: {
          some: {
            id: {
              in: products, // products is the array of product IDs from the request body
            },
          },
        },
      },
    });

    if (itemAlreadyAdded) {
      throw new ConflictException(
        'Single item cannot be added to flashsale more than once!!',
      );
    }

    await this.prisma.flashitem.update({
      where: { id: flashAvailable.id },
      data: {
        saleStart,
        saleEnd,
        products: {
          connect: availableProducts.map((product) => ({ id: product.id })),
        },
      },
    });

    await this.prisma.product.updateMany({
      where: {
        id: {
          in: products,
        },
      },
      data: {
        onSale: true,
      },
    });

    return res.status(200).json({
      message: 'Item added to the flash!!!',
    });
  }

  async deleteItemFromFlash(id: number, req: any, res: any) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    // const item = await this.prisma.product.findUnique({
    //   where: { id },
    // });

    // if (!(item && item.onSale)) {
    //   throw new NotFoundException('Item not found on sale!!');
    // }

    // const originalPrice=await this.prisma.product.findUnique({
    //     where:{id},
    //     select:{
    //         price:true
    //     }
    // })

    // await this.prisma.product.update({
    //   where: { id },

    //   data: {
    //     onSale: false,
    //     saleStart: null,
    //     saleEnd: null,
    //     discountprice: null,
    //   },
    // });

    res.status(201).json({
      message: 'Item removed from flash successfully!!',
    });
  }
}
