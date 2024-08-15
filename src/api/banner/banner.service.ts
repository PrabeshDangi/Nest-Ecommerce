import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { addProductDto } from './dto/addproduct.dto';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}
  async getBannerItems(res: Response) {
    const products = await this.prisma.banner.findMany();

    if (!products) {
      throw new NotFoundException('Items not found on banner!!');
    }

    return res.status(200).json({
      message: 'Banner items fetched successfully!!',
      data: products,
    });
  }

  async addItemToBanner(
    id: number,
    addproddto: addProductDto,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      return res.status(403).json({ error: 'User not authorized!' });
    }

    const { productId } = addproddto;
    try {
      const bannerAvail = await this.prisma.banner.findUnique({
        where: { id: id },
        include: { products: true },
      });

      if (!bannerAvail) {
        return res.status(404).json({ error: 'Banner not found!' });
      }

      const productExists = bannerAvail.products.some(
        (product) => product.id === productId,
      );

      if (productExists) {
        return res
          .status(400)
          .json({ error: 'Product is already in the banner!' });
      }

      if (bannerAvail.products.length >= 3) {
        return res
          .status(400)
          .json({ error: 'Banner can only have up to 3 products!' });
      }

      const newData = await this.prisma.banner.update({
        where: { id: id },
        data: {
          products: {
            connect: { id: productId },
          },
        },
      });

      return res.status(200).json({
        message: 'Product added to banner successfully!',
        data: newData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: 'An error occurred while adding the product to the banner.',
      });
    }
  }

  async getHello(req: Request, res: Response) {
    res.json({
      message: 'Hello from test function!!',
    });
  }
}
