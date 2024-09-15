import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitializePaymentDTO } from './dto/initpayment.dto';
import { CreateInvoiceDTO } from './dto/create-invoice.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('initialize-payment')
  async initializePayment(
    @Body() initpaymentdto: InitializePaymentDTO,
    @Body() createinvoicedto: CreateInvoiceDTO,
    @Req() req,
    @Res() res,
  ) {
    try {
      const result = await this.paymentService.initializePayment(
        initpaymentdto,
        createinvoicedto,
        req,
        res,
      );
      return res.json({
        data: result,
      });
    } catch (error) {
      return error;
    }
  }

  @Get('/verify')
  async completePayment(@Query() query: unknown) {
    return await this.paymentService.completePayment(query);
  }
}
