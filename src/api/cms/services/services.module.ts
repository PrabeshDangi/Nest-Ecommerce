import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { ImageUploadService } from 'src/global/services/imageupload.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicesController],
  providers: [ServicesService, ImageUploadService],
  exports: [ServicesService],
})
export class ServicesModule {}
