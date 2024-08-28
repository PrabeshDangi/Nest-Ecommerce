import { Controller, Post, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDto } from './dto/sendEmail.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // @Post('send')
  // async sendEmail(@Res() res) {
  //   const dto: sendEmailDto = {
  //     recepients: [
  //       { name: 'Prabesh Dangi', address: 'dangiprabesh58@gmail.com' },
  //     ],
  //     subject: 'Test email',
  //     html: '<h3>Hello from test email from mailtrap!!</h3>',
  //   };
  //   return this.emailService.sendEmail(dto, res);
  // }
}
