import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import * as crypto from 'crypto';
import axios from 'axios';
import { Response, response } from 'express';
import { HelperService } from 'src/common/helper/helper.service';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Processor('payment-queue')
export class PaymentProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly helperservice: HelperService,
  ) {
    super();
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.log(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'initialize-payment-job': {
        const result = this.handlePaymentInitialization(job);
        return result;
      }
      case 'complete-payment-job': {
        this.handlePaymentCompletion(job, response);
        break;
      }
    }
  }

  private async handlePaymentInitialization(job: Job) {
    const { combineddto, user } = job.data;

    const { billingInfo, itemId, totalPrice } = combineddto;

    const itemData = await this.prisma.product.findMany({
      where: {
        id: {
          in: itemId,
        },
      },
    });

    if (itemData.length === 0) {
      throw new Error('Items not found!!');
    }

    const itemInCart = await this.prisma.cart.findMany({
      where: {
        productId: {
          in: itemId,
        },
        userId: user.id,
      },
    });

    if (itemInCart.length === 0) {
      throw new Error('These items are not present on the cart of this user!!');
    }

    const purchasedData = await this.prisma.purchasedItem.create({
      data: {
        item: itemId,
        paymentMethod: 'esewa',
        totalPrice: totalPrice,
      },
    });

    const invoiceData = await this.prisma.invoice.create({
      data: {
        firstName: billingInfo.firstname,
        lastName: billingInfo.lastname,
        country: billingInfo.country,
        streetAddress: billingInfo.streetaddress,
        postalCode: billingInfo.postalcode,
        phone: billingInfo.phone,
        email: billingInfo.email,
        totalPrice: totalPrice,
        userId: user.id,
        orderId: purchasedData.id,
      },
    });

    await this.prisma.purchasedItem.update({
      where: {
        id: purchasedData.id,
      },
      data: {
        invoiceId: invoiceData.id,
      },
    });

    const Uuid = await this.helperservice.encodeToUUID(purchasedData.id);

    const paymentInitiate = await this.getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: Uuid,
    });

    return {
      paymentInitiate,
      purchasedProduct: purchasedData,
      transaction_uuid: Uuid,
    };
  }

  private async getEsewaPaymentHash({ amount, transaction_uuid }) {
    try {
      const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

      const secretKey = process.env.ESEWA_SECRET_KEY;
      const hash = crypto
        .createHmac('sha256', secretKey)
        .update(data)
        .digest('base64');

      return {
        signature: hash,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private async handlePaymentCompletion(job: Job, response: Response) {
    const { query } = job.data;
    try {
      const paymentInfo = await this.verifyEsewaPayment(query);

      const ItemId = await this.helperservice.decodeFromUUID(
        paymentInfo.response.transaction_uuid,
      );

      const purchasedItemData = await this.prisma.purchasedItem.findUnique({
        where: {
          id: ItemId,
        },
      });

      if (!purchasedItemData) {
        throw new NotFoundException('Purchased data not found!!');
      }

      await this.prisma.purchasedItem.update({
        where: {
          id: ItemId,
        },
        data: {
          status: 'success',
        },
      });

      await this.prisma.invoice.update({
        where: {
          orderId: ItemId,
        },
        data: {
          deliverystatus: 'dispatched',
        },
      });

      await this.prisma.payment.create({
        data: {
          pidx: paymentInfo.response.transaction_code,
          transactionId: paymentInfo.response.transaction_code,
          productId: ItemId,
          amount: purchasedItemData.totalPrice,
          dataFromVerificationReq: paymentInfo,
          paymentGateway: 'esewa',
          status: 'success',
        },
      });

      return response.redirect('https://exclusivenp.vercel.app/order-placed');
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  private async verifyEsewaPayment(encodedData: string) {
    try {
      const decodedData = await JSON.parse(encodedData);
      let headersList = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };

      const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

      const secretKey = process.env.ESEWA_SECRET_KEY;
      const hash = crypto
        .createHmac('sha256', secretKey)
        .update(data)
        .digest('base64');

      //console.log(hash);
      //console.log(decodedData.signature);
      let reqOptions = {
        url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
        method: 'GET',
        headers: headersList,
      };

      if (hash !== decodedData.signature) {
        return { message: 'Invalid Info', decodedData };
      }

      let response = await axios.request(reqOptions);

      if (
        response.data.status !== 'COMPLETE' ||
        response.data.transaction_uuid !== decodedData.transaction_uuid ||
        Number(response.data.total_amount) !== Number(decodedData.total_amount)
      ) {
        return { message: 'Invalid Info', decodedData };
      }

      return { response: response.data, decodedData };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
