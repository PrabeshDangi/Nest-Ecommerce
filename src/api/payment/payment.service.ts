import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import axios from 'axios';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { InitPaymentDTO } from './dto/combined-payment.dto';
import { HelperService } from 'src/common/helper/helper.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private helperservice: HelperService,
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

    const { billingInfo, itemId, totalPrice } = combineddto;

    try {
      const itemData = await this.prisma.product.findMany({
        where: {
          id: {
            in: itemId,
          },
        },
      });

      if (itemData.length === 0) {
        throw new NotFoundException('Items not found!!');
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
        throw new BadRequestException(
          'These items are not present on the cart of this user!!',
        );
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

      const purchasedProduct = await this.prisma.purchasedItem.update({
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
        //transaction_uuid: purchasedData.id,
        transaction_uuid: Uuid,
      });

      return res.json({
        paymentInitiate,
        purchasedProduct,
        transaction_uuid: Uuid,
      });
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async completePayment(query: string, res: Response) {
    try {
      const paymentInfo = await this.verifyEsewaPayment(query);
      console.log(paymentInfo);

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

      return res.redirect('https://exclusivenp.vercel.app/order-placed');
    } catch (error) {
      console.log(error);
      return error;
    }
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

      //Intended comment
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
