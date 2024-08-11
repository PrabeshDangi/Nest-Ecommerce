import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profile/profile.module';
import config from './config/config';
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/Guard/role.guard';
import { JwtGuard } from './auth/Guard/Jwt.guard';
import { ProductModule } from './product/product.module';


@Module({
  imports: [
  AuthModule,
  ConfigModule.forRoot({
    isGlobal:true,
    cache:true,
    load:[config]
    }),
  DatabaseModule,
  ProfileModule,
  CartModule,
  ProductModule
],
  controllers: [],
  providers: [ ],
})
export class AppModule {}

