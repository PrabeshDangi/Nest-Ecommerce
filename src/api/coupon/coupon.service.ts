import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async applyCoupon(userId: number, body: { couponCode: string }) {
    const couponAvailable = await this.prisma.coupon.findUnique({
      where: { code: body.couponCode },
    });

    if (!couponAvailable) {
      throw new NotFoundException('Coupon not found!!');
    }

    if (
      !couponAvailable.isActive ||
      new Date() > couponAvailable.expirationDate ||
      (couponAvailable.startDate && new Date() < couponAvailable.startDate) ||
      couponAvailable.currentUsageCount >= couponAvailable.maxUsageCount
    ) {
      throw new BadRequestException('Coupon is no longer available!!');
    }

    const couponUser = await this.prisma.userCoupon.findFirst({
      where: {
        userId,
        couponId: couponAvailable.id,
        isUsed: true,
      },
    });

    if (couponUser) {
      throw new BadRequestException('Coupon already used for this user!!');
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.userCoupon.create({
        data: {
          userId,
          couponId: couponAvailable.id,
          isUsed: true,
          usedAt: new Date(),
        },
      });

      await prisma.coupon.update({
        where: {
          id: couponAvailable.id,
        },
        data: {
          currentUsageCount: {
            increment: 1,
          },
        },
      });
    });

    return { message: 'Coupon applied successfully!!' };
  }

  async getCoupons() {
    const coupon = await this.prisma.coupon.findMany({
      where: {
        isActive: true,
      },
    });

    if (coupon.length === 0) {
      throw new NotFoundException('Coupon not found!!');
    }

    return coupon;
  }

  async createCoupon(createcoupondto: CreateCouponDto) {
    const couponAvailable = await this.prisma.coupon.findUnique({
      where: { code: createcoupondto.code },
    });

    if (couponAvailable) {
      throw new BadRequestException(
        'Coupon with this code has already been created!!',
      );
    }

    const couponData: any = {
      ...createcoupondto,
    };

    if (couponData.expirationDate.getDay() < new Date().getDay()) {
      throw new BadRequestException(
        'Expiration date cannot be less than current date!!',
      );
    }

    if (couponData.startDate) {
      if (couponData.start > couponData.expirationDate) {
        throw new BadRequestException(
          'Expiration date cannot be less than start date!!',
        );
      }

      if (couponData.startDate.getDay() < new Date().getDay()) {
        throw new BadRequestException(
          'Expiration date and start date cannot be less than current time!!',
        );
      }

      const newCoupon = await this.prisma.coupon.create({
        data: couponData,
      });

      return newCoupon;
    }

    return await this.prisma.coupon.create({
      data: {
        ...couponData,
        startDate: couponData.startDate ? couponData.startDate : new Date(),
      },
    });
  }

  async updateCoupon(id: number, updatecoupondto: UpdateCouponDto) {
    const couponAvailable = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!couponAvailable) {
      throw new NotFoundException('Coupon not found!!');
    }

    const updateData: any = {
      ...updatecoupondto,
    };

    if (updateData.startDate && updateData.expirationDate) {
      if (updateData.startDate >= updateData.expirationDate) {
        throw new BadRequestException(
          'Start date must be before the expiration date!!',
        );
      }
    }

    if (updateData.startDate) {
      if (updateData.startDate.getDay() < new Date().getDay()) {
        throw new BadRequestException(
          'Start date cannot be less than current date!!',
        );
      }

      if (updateData.startDate > couponAvailable.expirationDate) {
        throw new BadRequestException(
          'Coupon start date cannot be greater than expiration date!!',
        );
      }
    }

    if (updateData.expirationDate) {
      if (updateData.expirationDate.getDay() < new Date().getDay()) {
        throw new BadRequestException(
          'Expiration date cannot be less than current date and time!!',
        );
      }

      if (updateData.expirationDate < couponAvailable.startDate) {
        throw new BadRequestException(
          'Coupon expiration time cannot be less than start date!!',
        );
      }
    }

    const updatedCoupon = await this.prisma.coupon.update({
      where: { id },
      data: updateData,
    });
    return updatedCoupon;
  }

  async deleteCoupon(id: number) {
    const couponAvailable = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!couponAvailable) {
      throw new NotFoundException('Coupon not found!!');
    }

    await this.prisma.coupon.delete({
      where: { id },
    });

    return { message: 'Coupon deleted successfully!!' };
  }
}
