import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { HelperService } from 'src/common/helper/helper.service';
import { BullModule } from '@nestjs/bullmq';
import { bullConfig, paymentQueueConfig } from 'src/common/config/queue.config';
import { PaymentProcessor } from './payment.process';


@Module({
  imports: [
    PrismaModule,
    BullModule.forRoot(bullConfig),
    BullModule.registerQueue(paymentQueueConfig),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, HelperService, PaymentProcessor],
  exports: [PaymentService],
})
export class PaymentModule {}
