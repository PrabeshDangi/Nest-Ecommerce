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

  async applyCoupon(userId: number, couponCode: string) {
    const couponAvailable = await this.prisma.coupon.findUnique({
      where: {
        code: couponCode,
      },
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
        isUsed: false,
      },
    });

    if (!couponUser) {
      throw new BadRequestException('Coupon already used for this user!!');
    }

    await this.prisma.userCoupon.update({
      where: { id: couponAvailable.id },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    await this.prisma.coupon.update({
      where: {
        id: couponAvailable.id,
      },
      data: {
        currentUsageCount: {
          increment: 1,
        },
      },
    });

    return { message: 'Coupon applied successfully!!' };
  }

  async getCoupons() {
    const coupon = await this.prisma.coupon.findMany();

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

    const start = new Date(createcoupondto.startDate);
    const expire = new Date(createcoupondto.expirationDate);
    console.log(expire,start)

    if(expire<new Date()){
        throw new BadRequestException("Expiration date cannot be less than current time")
    }

    if (start && expire && start > expire) {
      throw new BadRequestException(
        'Start date must be before the expiration date!!',
      );
    }

    const couponData: any = {
      ...createcoupondto,
    };

    const newCoupon = await this.prisma.coupon.create({
      data: couponData,
    });

    return newCoupon;
  }

  async updateCoupon(id: number, updatecoupondto: UpdateCouponDto) {
    const couponAvailable = await this.prisma.coupon.findUnique({
      where: { id },
    });

    if (!couponAvailable) {
      throw new NotFoundException('Coupon not found!!');
    }

    if (
      updatecoupondto.startDate &&
      updatecoupondto.expirationDate &&
      updatecoupondto.startDate > updatecoupondto.expirationDate
    ) {
      throw new BadRequestException(
        'Start date must be before the expiration date!!',
      );
    }

    const updateData: any = {
      ...updatecoupondto,
    };

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
