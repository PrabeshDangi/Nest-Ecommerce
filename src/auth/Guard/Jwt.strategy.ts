import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { Request } from "express";
import { UserRole } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
      const secret = configService.get<string>('jwtSecret');
    //   console.log('JWT Secret in JwtStrategy:', secret); 
  
      super({
        jwtFromRequest: ExtractJwt.fromExtractors([
          JwtStrategy.extractJWT,
          ExtractJwt.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: process.env.jwtSecret,
      });
    }

    private static extractJWT(req:Request):string | null{
        const tokenFromCookie = req.cookies && req.cookies.token;
        const tokenFromHeader = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if(!(tokenFromCookie || tokenFromHeader))
        {
            return null;
        }
        // console.log('Extracting JWT - Cookie:', tokenFromCookie, 'Header:', tokenFromHeader);

    
        return tokenFromCookie || tokenFromHeader;
       
    }


    async validate(payload: { id: number; email: string ; role:UserRole}) {

       const user = { id: payload.id, email: payload.email,role:payload.role }; 
        if (!user) {
            throw new UnauthorizedException('Invalid JWT payload');
          }
        return user;
      }
}