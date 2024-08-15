import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private prisma: PrismaService) {}

  async getMyWishlist(req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const userWishList = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        Wishlist: {
          select: {
            product: true,
          },
        },
      },
    });

    const wishList = userWishList.Wishlist.map((item) => item.product);

    if (!wishList) {
      throw new NotFoundException('No product found in wishlist!!');
    }

    return res.status(200).json({
      message: 'Wishlist fetched successfully!!',
      data: wishList,
    });
  }

  async addToList(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const existingProduct = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
    });

    if (existingProduct) {
      throw new ConflictException('Product already in wishlist.');
    }

    const addedProduct = await this.prisma.wishlist.create({
      data: {
        userId: user.id,
        productId: id,
      },
    });

    if (!addedProduct) {
      throw new BadRequestException(
        'Error adding the product to the wishlist!!',
      );
    }

    return res.status(201).json({
      message: 'Item added to the wishlist!!',
      data: addedProduct,
    });
  }

  async deleteAllFromList(req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const listItems = await this.prisma.wishlist.findMany({
      where: {
        userId: user.id,
      },
    });

    if (listItems.length === 0) {
      throw new NotFoundException('No items on wishlist!!');
    }

    await this.prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return res.status(200).json({
      message: 'All items from wishlist deleted!!',
    });
  }

  async deleteFromList(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const productAvailable = await this.prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
    });

    if (!productAvailable) {
      throw new NotFoundException('Product not found in wishList!! ');
    }

    const deletedItem = await this.prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
    });

    if (!deletedItem) {
      throw new NotFoundException('Item deletion error!!');
    }

    return res.status(200).json({
      message: 'Item deleted successfully from wishlist!!',
    });
  }
}
