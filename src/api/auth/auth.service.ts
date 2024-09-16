import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { cookieOptions } from 'src/constant';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { EmailService } from 'src/global/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private emailService: EmailService,
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

    const verificationToken = await this.generateToken(newuser.email);

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
      .status(200)
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

    const token = await this.signToken({
      id: userAvailable.id,
      email: userAvailable.email,
    });

    if (!token) {
      throw new BadRequestException('token not available!!');
    }

    res.status(200).cookie('token', token, cookieOptions).json({
      message: 'User logged in successfully!!',
      token,
    });
  }

  async SignoutUser(res: Response) {
    try {
      res.clearCookie('token');
      return res.status(200).json({
        message: 'User logged out successfully!!',
      });
    } catch (error) {
      return res.status(400).json({
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

      res.clearCookie('email_verification_token').status(200).json({
        message: 'Email verifies successfully!!',
      });
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Invalid or expired verification token!!');
    }
  }

  async hashPassword(password: string) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }

  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;
    return this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  async generateToken(email: string) {
    return this.jwt.sign(
      { email },
      { secret: process.env.JWT_SECRET, expiresIn: '2m' },
    );
  }
}
