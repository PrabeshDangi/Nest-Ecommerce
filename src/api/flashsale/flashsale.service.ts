import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { AddFlashDto } from './dto/addItem.dto';

@Injectable()
export class FlashsaleService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFlashItems() {
    const flashItems = await this.prisma.flashitem.findMany({
      select: {
        products: true,
        saleEnd: true,
        saleStart: true,
      },
      where: {
        saleEnd: { gt: new Date() },
      },
    });

    if (flashItems.length === 0) {
      return { message: 'Flashsale not found!!' };
    }

    const responseData = flashItems.map((flashItem) => ({
      saleStart: flashItem.saleStart,
      saleEnd: flashItem.saleEnd,
      products: flashItem.products,
    }));

    if (responseData.length === 0) {
      return { message: 'No items found on flashsale!!' };
    }

    return {
      message: 'Flash items fetched successfully',
      data: responseData,
    };
  }

  async addItemToFlash(addflashdto: AddFlashDto, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const { saleStart, saleEnd, products } = addflashdto;

    // Parse saleStart and saleEnd to Date objects
    const start = new Date(saleStart);
    const end = new Date(saleEnd);
    const now = new Date();

    if (start.getDay() < now.getDay()) {
      throw new BadRequestException(
        'Sale start date should be greater than the current date and time!!',
      );
    }

    if (end <= start || end <= now) {
      throw new BadRequestException(
        'Sale start date must be smaller than the sale end date, and sale end date must not be less than the current time!!',
      );
    }

    const availableProducts = await this.prisma.product.findMany({
      where: {
        id: {
          in: products,
        },
      },
    });

    if (availableProducts.length === 0) {
      throw new NotFoundException('No products found with the given IDs!!');
    }

    const flashAvailable = await this.prisma.flashitem.findFirst();

    if (!flashAvailable) {
      await this.prisma.flashitem.create({
        data: {
          saleStart: start,
          saleEnd: end,
          products: {
            connect: availableProducts.map((product) => ({ id: product.id })),
          },
        },
      });
      return res.status(200).json({
        message: 'Item added to the flash sale!',
      });
    }

    const itemAlreadyAdded = await this.prisma.flashitem.findFirst({
      where: {
        id: flashAvailable.id,
        products: {
          some: {
            id: {
              in: products,
            },
          },
        },
      },
    });

    if (itemAlreadyAdded) {
      throw new ConflictException(
        'Single item cannot be added to the flash sale more than once!!',
      );
    }

    await this.prisma.flashitem.update({
      where: { id: flashAvailable.id },
      data: {
        saleStart: start,
        saleEnd: end,
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
      message: 'Items added to the flash sale!',
    });
  }

  async deleteItemFromFlash(id: number, req: Request, res: Response) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const flashAvailable = await this.prisma.flashitem.findFirst({
      where: {
        products: {
          some: {
            id: id,
          },
        },
      },
      select: {
        id: true,
        products: true,
      },
    });

    if (!flashAvailable) {
      return res.status(404).json({
        message: 'Flash sale or item not found!',
      });
    }

    const itemFoundInFlash = await this.prisma.flashitem.findFirst({
      where: {
        products: {
          some: {
            id: id,
          },
        },
      },
    });

    if (!itemFoundInFlash) {
      throw new NotFoundException('Item not found in any flash sale!');
    }

    await this.prisma.flashitem.update({
      where: { id: itemFoundInFlash.id },
      data: {
        products: {
          disconnect: { id },
        },
      },
    });

    res.status(200).json({
      message: 'Item removed from flash successfully!!',
    });
  }

  async deleteAllItemsFromFlash(req: Request, res: Response) {
    const flashItems = await this.prisma.flashitem.findMany({
      select: {
        id: true,
        products: true,
      },
    });

    const productIds = flashItems.flatMap((flashItem) =>
      flashItem.products.map((product) => product.id),
    );

    for (const flashItem of flashItems) {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.flashitem.update({
          where: { id: flashItem.id },
          data: {
            saleEnd: new Date(),
            saleStart: new Date(),
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

    return res.status(200).json({
      message: 'All the flashsale items deleted!!',
    });
  }
}
