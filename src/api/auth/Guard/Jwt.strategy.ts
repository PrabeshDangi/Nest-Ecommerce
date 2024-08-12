import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { Request } from "express";
import { PrismaService } from "src/global/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
      private prisma:PrismaService
    ) {
  
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([
          JwtStrategy.extractJWT,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: process.env.jwtsecret,
      });
    }

    private static extractJWT(req:Request):string | null{
        const tokenFromCookie = req.cookies && req.cookies.token;
        const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if(!(tokenFromCookie || tokenFromHeader))
        {
            return null;
        }

    
        return tokenFromCookie || tokenFromHeader;
       
    }


    async validate(payload: { id: number; email: string }) {

      if (!payload) {
        throw new UnauthorizedException('Invalid JWT payload');
    }

    const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, email: true, role: true },
    });

    if (!user) {
        throw new UnauthorizedException('User not found');
    }

    return user; 
}
}