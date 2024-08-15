import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getMyCart(req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const userWithCart = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        cart: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!userWithCart) {
      throw new ForbiddenException('User not found!!');
    }

    const mycart = userWithCart.cart.map((cartItem) => cartItem.product);

    return res.status(200).json({
      message: 'Cart items fetched successfully!!',
      data: mycart,
    });
  }

  async addItem(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!! ');
    }

    const itemAvailable = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!itemAvailable) {
      throw new NotFoundException('Item not available!!');
    }

    const isAlreadyInCart = await this.prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
    });

    if (isAlreadyInCart) {
      throw new BadRequestException('Item already on the cart!!');
    }

    await this.prisma.cart.create({
      data: {
        userId: user.id,
        productId: id,
      },
    });

    return res.status(201).json({
      message: 'Item added to cart!!',
    });
  }

  async deleteProductFromCart(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const item = await this.prisma.cart.findUnique({
      where: {
        id: id,
      },
    });

    if (!item) {
      throw new BadRequestException('Cart not found!!');
    }

    const deletedCartItem = await this.prisma.cart.deleteMany({
      where: {
        userId: user.id,
        productId: id,
      },
    });

    if (deletedCartItem.count === 0) {
      throw new NotFoundException('Product not found in cart');
    }

    return res.status(200).json({
      message: 'Product removed from cart successfully!!',
    });
  }

  async deleteAllItems(req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const deletedCartItem = await this.prisma.cart.deleteMany({
      where: {
        userId: user.id,
      },
    });

    if (deletedCartItem.count === 0) {
      throw new NotFoundException('No products found in cart');
    }

    return res.status(200).json({
      message: 'All the cart items deleted successfully!!',
    });
  }
}
