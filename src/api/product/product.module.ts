import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { ImageUploadService } from 'src/global/services/imageupload.service';
import { HelperService } from 'src/common/helper/helper.service';
import { RateLimiterMiddleware } from 'src/common/middlewares/ratelimiting.middleware';


@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ImageUploadService,
    HelperService,
  ],
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('*');// Yo configuration le sabai route lai rate limit garchha!!
  }
}
