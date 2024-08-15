import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { cookieOptions } from 'src/constant';
import { PrismaService } from 'src/global/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private configservice: ConfigService,
  ) {}

  async SignupUser(signupdto: SignupDto) {
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

    return {
      message: 'New user created successfully!!',
      data: newuser,
    };
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

  async hashPassword(password: string) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }

  async checkPassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;
    const secret = this.configservice.get<string>('jwtsecret');
    return this.jwt.sign(payload, { secret });
  }
}
