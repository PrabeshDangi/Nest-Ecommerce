import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports:[AuthModule,DatabaseModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
