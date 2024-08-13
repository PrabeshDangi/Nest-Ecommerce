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

// global
@Module({
  imports: [
  AuthModule,
  ConfigModule.forRoot({
    isGlobal:true,
    cache:true,
    load:[config]
    }),
  PrismaModule,
  ProfileModule,
  CartModule,
  ProductModule,
  WishlistModule,
  FlashsaleModule
],
  controllers: [],
  providers: [ SaleScheduler],
})
export class AppModule {}

