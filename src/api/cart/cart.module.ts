import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { RateLimiterMiddleware } from 'src/common/middlewares/ratelimiting.middleware';

@Module({
  imports:[AuthModule,PrismaModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('*'); 
  }
}
