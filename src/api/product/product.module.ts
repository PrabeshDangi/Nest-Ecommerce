import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { ImageUploadService } from 'src/global/services/imageupload.service';
import { HelperService } from 'src/common/helper/helper.service';
import { SearchScheduleService } from 'src/global/services/search/searchschedule.service';
import { SearchModule } from 'src/global/elasticsearch/search.module';
import { SearchService } from 'src/global/elasticsearch/search.service';

@Module({
  imports: [PrismaModule, SearchModule],
  controllers: [ProductController],
  providers: [
    ProductService,
    ImageUploadService,
    HelperService,
    SearchScheduleService,
    SearchService,
  ],
})
export class ProductModule {}
