import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    
  ) {}

  @Post('signup')
  SignupUser(@Body() signupdto:SignupDto){
    return this.authService.SignupUser(signupdto)
  }

  @Post('signin')
  SigninUser(@Body() signindto:LoginDto,@Res() res){
    return this.authService.SigninUser(signindto,res)
  }

  @Post('signout')
  SignoutUser(@Res() res){
    return this.authService.SignoutUser(res)
  }
}
