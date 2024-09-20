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
      select: {
        cart: {
          select: {
            product: true,
            quantity: true,
          },
        },
      },
    });

    if (!userWithCart) {
      throw new ForbiddenException('User not found!!');
    }

    if (userWithCart.cart.length === 0) {
      return res.status(404).json({
        message: 'Cart item not found for this user!!',
        data: [],
      });
    }

    return res.status(200).json({
      message: 'Cart items fetched successfully!!',
      data: userWithCart.cart,
    });
  }

  async addItem(id: number, type: string, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!! ');
    }

    const itemAvailable = await this.prisma.product.findUnique({
      where: { id },
      select: {
        stock: true,
      },
    });

    if (!itemAvailable) {
      throw new NotFoundException('Item not available at the momemet!!');
    }

    const isAlreadyInCart = await this.prisma.cart.findFirst({
      where: {
        userId: user.id,
        productId: id,
      },
    });

    if (type == 'add') {
      if (!isAlreadyInCart) {
        const newCartItem = await this.prisma.cart.create({
          data: {
            userId: user.id,
            productId: id,
          },
        });

        return res.status(201).json({
          message: 'Item added to cart!!',
          data: newCartItem,
        });
      }
      const currentQuantity = isAlreadyInCart.quantity;

      if (currentQuantity >= itemAvailable.stock) {
        throw new BadRequestException('Item out of stock!!');
      }

      await this.prisma.cart.update({
        where: { id: isAlreadyInCart.id },
        data: {
          quantity: { increment: 1 },
        },
      });

      return res.status(200).json({
        message: 'Cart quantity increased by 1!!',
      });
    } else if (type == 'sub') {
      if (!isAlreadyInCart) {
        return res.status(404).json({
          message: 'Item not found on cart!!',
        });
      }

      if (isAlreadyInCart.quantity <= 1) {
        throw new BadRequestException('Cart quantity cannot be less than 1!!');
      }

      await this.prisma.cart.update({
        where: { id: isAlreadyInCart.id },
        data: {
          quantity: { decrement: 1 },
        },
      });
      return res.status(200).json({
        message: 'Cart quantity reduced!!',
      });
    } else {
      return res.status(400).json({
        message: 'Invalid type parameter!!',
      });
    }
  }

  async deleteProductFromCart(id: number, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const item = await this.prisma.cart.findMany({
      where: {
        userId: user.id,
        productId: id,
      },
    });

    if (!item) {
      throw new BadRequestException('Item not found on cart!!');
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
