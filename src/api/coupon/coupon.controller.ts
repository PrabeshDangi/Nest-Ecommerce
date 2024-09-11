import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';
import { JwtGuard } from '../auth/Guard/Jwt.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Roles(Role.User)
  @HttpCode(HttpStatus.OK)
  @Post('apply')
  async applyCoupon(@Req() req, @Body() couponCode: string) {
    const user = req.user as { id: number; email: string };
    const userId = user.id;
    return this.couponService.applyCoupon(userId, couponCode);
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCoupons( ) {
    try {
      return await this.couponService.getCoupons();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCoupon(@Body() createcoupondto: CreateCouponDto) {
    try {
      return await this.couponService.createCoupon(createcoupondto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateCoupon(
    @Param('id', ParseIntPipe) id: number,
    updatecoupondto: UpdateCouponDto,
  ) {
    try {
      return await this.couponService.updateCoupon(id, updatecoupondto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Roles(Role.Admin)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteCoupon(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.couponService.deleteCoupon(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
