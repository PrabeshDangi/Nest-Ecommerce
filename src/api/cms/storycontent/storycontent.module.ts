import { Module } from '@nestjs/common';
import { StorycontentService } from './storycontent.service';
import { StorycontentController } from './storycontent.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { ImageUploadService } from 'src/global/services/imageupload.service';

@Module({
  imports: [PrismaModule],
  controllers: [StorycontentController],
  providers: [StorycontentService, ImageUploadService],
  exports: [StorycontentService],
})
export class StorycontentModule {}
