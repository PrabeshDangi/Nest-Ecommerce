import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { HelperService } from 'src/common/helper/helper.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [PaymentService, HelperService],
  exports: [PaymentService],
})
export class PaymentModule {}
