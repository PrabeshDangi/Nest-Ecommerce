import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { ImageUploadService } from 'src/global/services/imageupload.service';

@Module({
  imports: [PrismaModule],
  controllers: [StatisticsController],
  providers: [StatisticsService, ImageUploadService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
