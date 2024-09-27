import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RtGuard } from './Guard/Refresh.guard';
import {
  accessTokenOption,
  refreshTokenOption,
} from 'src/global/Constants/cookie.option';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async SignupUser(@Body() signupdto: SignupDto, @Res() res) {
    try {
      return await this.authService.SignupUser(signupdto, res);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  SigninUser(@Body() signindto: LoginDto, @Res() res) {
    return this.authService.SigninUser(signindto, res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  SignoutUser(@Res() res) {
    return this.authService.SignoutUser(res);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-email')
  async verifyEmail(@Query('token') token: string, @Req() req, @Res() res) {
    return this.authService.verifyEmail(token, req, res);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RtGuard)
  @Post('/token-refresh')
  async refreshToken(@Req() req, @Res() res) {
    const tokens = await this.authService.refreshToken(req);

    res
      .cookie('refresh_token', tokens.refreshToken, refreshTokenOption)
      .cookie('access_token', tokens.accessToken, accessTokenOption)
      .json({
        message:"Token refreshed successfully!!",
        refreshtoken:tokens.refreshToken,
        accesstoken:tokens.accessToken
      })
  }
}
