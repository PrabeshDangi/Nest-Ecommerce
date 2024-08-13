import { Module } from '@nestjs/common';
import { FlashsaleService } from './flashsale.service';
import { FlashsaleController } from './flashsale.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [FlashsaleController],
  providers: [FlashsaleService],
})
export class FlashsaleModule {}
