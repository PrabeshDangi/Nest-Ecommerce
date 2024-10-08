import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './api/auth/auth.module';
import { CartModule } from './api/cart/cart.module';
import { ProductModule } from './api/product/product.module';
import { ProfileModule } from './api/profile/profile.module';
import config from './common/config/config';
import { PrismaModule } from './global/prisma/prisma.module';
import { WishlistModule } from './api/wishlist/wishlist.module';
import { FlashsaleModule } from './api/flashsale/flashsale.module';
import { SaleScheduler } from './global/services/scheduler.service';
import { CategoryModule } from './api/category/category.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BannerModule } from './api/banner/banner.module';
import { EmailModule } from './global/email/email.module';
import { RatingModule } from './api/rating/rating.module';
import { CmsModule } from './api/cms/cms.module';
import { CouponModule } from './api/coupon/coupon.module';
import { PaymentModule } from './api/payment/payment.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './common/guard/ratelimit.guard';

// global
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 1,
      },
      {
        name: 'medium',
        ttl: 5000,
        limit: 3,
      },
      {
        name: 'long',
        ttl: 10000,
        limit: 5,
      },
    ]),
    ScheduleModule.forRoot(),
    PrismaModule,
    ProfileModule,
    CartModule,
    ProductModule,
    WishlistModule,
    FlashsaleModule,
    CategoryModule,
    BannerModule,
    EmailModule,
    RatingModule,
    CmsModule,
    CouponModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [SaleScheduler,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
