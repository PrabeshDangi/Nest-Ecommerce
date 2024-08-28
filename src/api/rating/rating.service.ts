import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createRatingDTO } from './dto/create-rating.dto';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { updateRatingDTO } from './dto/update-rating.dto';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async createRating(
    id: number,
    createproductdto: createRatingDTO,
    req: Request,
    res: Response,
  ) {
    const { rating, comment } = createproductdto;

    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const productAvailable = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productAvailable) {
      throw new NotFoundException('Product not found!!');
    }

    const ratingData = await this.prisma.rating.create({
      data: {
        rating,
        comment,
        user: { connect: { id: user.id } },
        product: { connect: { id } },
      },
    });

    return res.status(201).json({
      message: 'Rating created successfuly!!',
      data: ratingData,
    });
  }

  async updateRating(
    id: number,
    updateratingdto: updateRatingDTO,
    req: Request,
    res: Response,
  ) {
    const { rating, comment } = updateratingdto;

    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const ratingAvailable = await this.prisma.rating.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!ratingAvailable) {
      throw new NotFoundException(' Rating not found from this user!!');
    }

    const updatedRating = await this.prisma.rating.update({
      where: { id: ratingAvailable.id },
      data: {
        rating,
        comment,
      },
    });

    return res.status(200).json({
      message: 'Rating updated successfully!!',
      data: updatedRating,
    });
  }

  async deleteRating(id: number, req: Request) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const ratingAvailable = await this.prisma.rating.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!ratingAvailable) {
      throw new NotFoundException('Rating not found from this user!!');
    }

    await this.prisma.rating.delete({
      where: { id },
    });
    return { message: 'Rating deleted successfully!!' };
  }
}
