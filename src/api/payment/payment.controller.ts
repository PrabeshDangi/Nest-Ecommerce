import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { InitPaymentDTO } from './dto/combined-payment.dto';
import { JwtGuard } from '../auth/Guard/Jwt.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User)
  @Post('initialize-payment')
  async initializePayment(
    @Body() combineddto: InitPaymentDTO,
    @Req() req,
    @Res() res,
  ) {
    try {
      const result = await this.paymentService.initializePayment(
        combineddto,
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
  async completePayment(@Query() query: string, @Res() res) {
    return await this.paymentService.completePayment(query, res);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.User)
  @Get('invoices')
  async getMyInvoices(@Req() req, @Res() res) {
    try {
      const user = req.user as { id: number; email: string };
      if (!user) {
        throw new ForbiddenException('User not authorized!!');
      }
      const result = await this.paymentService.getMyInvoices(user.id);
      return { result };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
