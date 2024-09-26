import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.ACCESS_SECRET,
    });
  }

  private static extractJWT(req: Request): string | null {
    const tokenFromCookie = req.cookies?.access_token;
    const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    return tokenFromCookie || tokenFromHeader || null;
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid JWT payload');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
