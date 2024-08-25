import { Controller, Post, Res } from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDto } from './dto/sendEmail.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Res() res){

    const dto:sendEmailDto={
      from:{name:"Prabesh",address:"Libali"},
      recepients:[{name:"Test Kumar",address:"testkumar@gmail.com"}],
      subject:"Test email",
      html:"<h3>Hello from test email!!</h3>"
    }
    return this.emailService.sendEmail(dto,res)
  }
}
