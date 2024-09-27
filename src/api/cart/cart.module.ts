import {  Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { PrismaModule } from 'src/global/prisma/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}


