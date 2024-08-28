import { Body, Controller, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  SignupUser(@Body() signupdto: SignupDto, @Res() res) {
    return this.authService.SignupUser(signupdto, res);
  }

  @Post('signin')
  SigninUser(@Body() signindto: LoginDto, @Res() res) {
    return this.authService.SigninUser(signindto, res);
  }

  @Post('signout')
  SignoutUser(@Res() res) {
    return this.authService.SignoutUser(res);
  }

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string, @Req() req, @Res() res) {
    return this.authService.verifyEmail(token, req, res);
  }
}
