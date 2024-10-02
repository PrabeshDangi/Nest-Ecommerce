import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { Request, Response } from 'express';

@Injectable()
export class BannerService {
  constructor(private readonly prisma: PrismaService) {}

  async getBannerItem(res: Response) {
    const bannerItems = await this.prisma.banner.findMany({
      include: {
        products: {
          select: {
            id: true,
            title: true,
            image: true,
            description: true,
            brand: true,
          },
        },
      },
    });

    if (bannerItems.length === 0) {
      throw new NotFoundException('Banner items not founddddd!!');
    }

    const bannerData = bannerItems.flatMap((banner) =>
      banner.products.map((product) => ({
        id: product.id,
        title: product.title,
        image: product.image,
        description: product.description,
        brand: product.brand,
      })),
    );

    return res.status(200).json({
      message: 'Banner items fetched successfully!!',
      bannerData,
    });
  }

  async addBannerItem(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const productAvailable = await this.prisma.product.findMany({
      where: { id },
    });

    if (!productAvailable) {
      throw new NotFoundException('Product not found!!');
    }

    const banner = await this.prisma.banner.findFirst();

    if (!banner) {
      await this.prisma.banner.create({
        data: {
          title: 'Banner',
          products: {
            connect: { id },
          },
        },
      });
      return res.status(201).json({
        message: 'Item added on banner!!',
      });
    }

    const isProductInBanner = await this.prisma.banner.findFirst({
      where: {
        products: {
          some: {
            id,
          },
        },
      },
    });

    if (isProductInBanner) {
      throw new BadRequestException('Product is already in the banner!!');
    }

    await this.prisma.banner.update({
      where: { id: banner.id },
      data: {
        products: {
          connect: { id },
        },
      },
    });

    return res.status(200).json({
      message: 'Product added to the banner successfully!!',
    });
  }

  async deleteItem(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const isProductInBanner = await this.prisma.banner.findFirst({
      where: {
        products: {
          some: {
            id,
          },
        },
      },
    });

    if (!isProductInBanner) {
      throw new BadRequestException('Product is not available in the banner!!');
    }

    await this.prisma.banner.update({
      where: { id: isProductInBanner.id },
      data: {
        products: {
          disconnect: { id },
        },
      },
    });

    return res.status(200).json({
      message: 'Item succesfully removed from the banner!!',
    });
  }
}
