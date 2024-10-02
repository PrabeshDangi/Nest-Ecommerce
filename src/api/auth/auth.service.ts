import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { EmailService } from 'src/global/email/email.service';
import {
  accessTokenOption,
  refreshTokenOption,
} from 'src/global/Constants/cookie.option';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async SignupUser(signupdto: SignupDto, res: Response) {
    const { name, email, phone, password } = signupdto;

    const isUserAvailable = await this.prisma.user.findUnique({
      where: { email },
    });

    if (isUserAvailable) {
      throw new BadRequestException('Email already registered!!');
    }

    const hashedpassword = await this.hashPassword(password);

    const newuser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedpassword,
        phone,
        role: signupdto.role || 'user',
      },
    });

    const verificationToken = await this.generateEmailVerificationToken(
      newuser.email,
    );

    await this.emailService.sendVerificationEmail(
      newuser.email,
      verificationToken,
    );

    return res
      .cookie('email_verification_token', verificationToken, {
        httpOnly: true,
        secure: false, //true for https
        sameSite: 'lax',
        maxAge: 2 * 60 * 1000,
      })
      .json({
        message: 'Please verify your email',
        data: newuser,
      });
  }

  async SigninUser(signindto: LoginDto, res: Response) {
    const { email, password } = signindto;

    const userAvailable = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userAvailable) {
      throw new BadRequestException('Email not registered!!');
    }

    const isPasswordCorrect = await this.checkPassword(
      password,
      userAvailable.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { accessToken, refreshToken } = await this.signTokens({
      id: userAvailable.id,
      name: userAvailable.name,
      role: userAvailable.role,
    });

    res
      .cookie('refresh_token', refreshToken, refreshTokenOption)
      .cookie('access_token', accessToken, accessTokenOption)
      .json({
        message: 'User logged in successfully!!',
        accessToken,
        refreshToken,
      });
  }

  async SignoutUser(res: Response) {
    try {
      res.clearCookie('token');
      return res.json({
        message: 'User logged out successfully!!',
      });
    } catch (error) {
      return res.json({
        message: 'Internal server error.',
      });
    }
  }

  async verifyEmail(token: string, req: Request, res: Response) {
    if (!token) {
      throw new BadRequestException('Token not found!!');
    }

    try {
      const decodedInfo = await this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { email: decodedInfo.email },
      });

      if (!user) {
        throw new BadRequestException('User not found!!');
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailVerified: true,
        },
      });

      res.clearCookie('email_verification_token').json({
        message: 'Email verifies successfully!!',
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid or expired verification token!!');
    }
  }

  async refreshToken(req: Request) {
    const incomingrefreshToken = req.cookies.refresh_token;

    if (!incomingrefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const decodedToken = await this.jwt.verify(incomingrefreshToken, {
        secret: process.env.REFRESH_SECRET,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: decodedToken.id },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token!!');
      }

      const { accessToken, refreshToken } = await this.signTokens({
        id: decodedToken.id,
        name: decodedToken.name,
        role: decodedToken.role,
      });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid token!!');
    }
  }

  private async hashPassword(password: string) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }

  private async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async signTokens(args: { id: number; name: string; role: string }) {
    const { id, name, role } = args;
    const accessToken = await this.generateAccessToken({ id, role });
    const refreshToken = await this.generateRefreshToken({ id, name });

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(payload: { id: number; role: string }) {
    return this.jwt.sign(payload, {
      secret: process.env.ACCESS_SECRET,
      expiresIn: process.env.ACCESS_EXPIRY,
    });
  }

  private async generateRefreshToken(payload: { id: number; name: string }) {
    return this.jwt.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRY,
    });
  }

  private async generateEmailVerificationToken(email: string) {
    return this.jwt.sign(
      { email },
      { secret: process.env.JWT_SECRET, expiresIn: '2m' },
    );
  }
}
