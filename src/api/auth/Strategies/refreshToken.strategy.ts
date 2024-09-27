import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  private static extractJWT(req: Request): string | null {
    const tokenFromCookie = req.cookies?.refresh_token;
    const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!(tokenFromCookie || tokenFromHeader)) {
      return null;
    }

    return tokenFromCookie || tokenFromHeader;
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Invalid Payload!!');
    }
    return payload;
  }
}
