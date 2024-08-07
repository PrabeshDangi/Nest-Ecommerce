import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategy} from 'passport-jwt'
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    
    constructor(private configservice:ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
              JwtStrategy.extractJWT,
              ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey:configservice.get<string>('jwtsecret'),
        });
    }

    private static extractJWT(req:Request):string|null{
        console.log('Extracting JWT from cookies:', req.cookies.token);
        if(req.cookies && 'token' in req.cookies){
            return req.cookies.token
        }
        return null
    }


    async validate(payload: { id: string; email: string }) {
        if (!payload) {
            throw new UnauthorizedException('Invalid JWT payload');
          }
          console.log('Validating JWT payload:', payload);
        return payload;
      }
}