import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';

import { Request, Response } from 'express';
import { InitPaymentDTO } from './dto/combined-payment.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue, QueueEvents } from 'bullmq';

@Injectable()
export class PaymentService {
  constructor(
    @InjectQueue('payment-queue')
    private readonly addPaymentToQueue: Queue,
    private readonly prisma: PrismaService,
  ) {}

  async initializePayment(
    combineddto: InitPaymentDTO,
    req: Request,
    res: Response,
  ) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const job = await this.addPaymentToQueue.add('initialize-payment-job', {
      combineddto,
      user,
    });

    const queueEvents = new QueueEvents('payment-queue');

    const result = await job.waitUntilFinished(queueEvents);

    return res.json({
      message: 'Payment processing initiated!!',
      data: result,
    });
  }

  async completePayment(query: string, res: Response) {
    const job = await this.addPaymentToQueue.add('complete-payment-job', {
      query,
    });

    const queueEvents = new QueueEvents('payment-queue');

    const result = await job.waitUntilFinished(queueEvents);

    return res.json({
      message: 'Payment verfication and completion process going on!!',
      data: result,
    });
  }

  async getMyInvoices(userId: number) {
    const myInvoices = await this.prisma.invoice.findMany({
      where: {
        userId: userId,
      },
    });

    if (myInvoices.length === 0) {
      throw new NotFoundException('Invoices not found for this user!!');
    }

    return { myInvoices };
  }
}
