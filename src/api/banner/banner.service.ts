import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { addItemDto } from './dto/additem.dto';
import { Request, Response } from 'express';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async getBannerItem(res: Response) {
    const bannerItems = await this.prisma.banner.findMany({
      include: {
        products: {
          select: {
            title: true,
            image: true,
          },
        },
      },
    });

    if (bannerItems.length === 0) {
      throw new NotFoundException('Banner items not founddddd!!');
    }

    const bannerData = bannerItems.map((banner) => ({
      products: banner.products.map((product) => ({
        title: product.title,
        image: product.image,
      })),
    }));
    return res.status(200).json({
      message: 'Banner items fetched successfully!!',
      data: bannerData,
    });
  }

  async addBannerItem(
    id: number,
    addItemdto: addItemDto,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };
    const { productId } = addItemdto;
    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const productAvailable = await this.prisma.product.findMany({
      where: { id: productId },
    });

    if (!productAvailable) {
      throw new NotFoundException('Product not found!!');
    }

    const banner = await this.prisma.banner.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found!!');
    }

    const isProductInBanner = banner.products.some(
      (product) => product.id === productId,
    );

    if (isProductInBanner) {
      throw new BadRequestException('Product is already in the banner!!');
    }

    await this.prisma.banner.update({
      where: { id },
      data: {
        products: {
          connect: { id: productId },
        },
      },
    });

    return res.status(200).json({
      message: 'Product added to the banner successfully!!',
    });
  }

  async deleteItem(
    deletedto: addItemDto,
    id: number,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const { productId } = deletedto;

    const banner = await this.prisma.banner.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!banner) {
      throw new NotFoundException('Banner not found!!');
    }

    const isProductInBanner = banner.products.some(
      (product) => product.id === productId,
    );

    if (!isProductInBanner) {
      throw new BadRequestException('Product is not available in the banner!!');
    }

    await this.prisma.banner.update({
      where: { id },
      data: {
        products: {
          disconnect: { id: productId },
        },
      },
    });

    return res.status(200).json({
      message: 'Item succesfully removed from the banner!!',
    });
  }
}
