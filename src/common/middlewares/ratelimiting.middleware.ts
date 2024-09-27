import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import redisRateLimit from 'rate-limit-redis';
import redisClient from '../config/redisconfig';


@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    store: new redisRateLimit({
      sendCommand: (...args: any) => redisClient.sendCommand(args),
      resetExpiryOnChange: true,
    }),
    
    windowMs:2*1000,
    limit:3,
    message: 'Too many requests from this IP, please try again later.',

    keyGenerator: (req: Request) => {
      const xForwardedFor = req.headers['x-forwarded-for'];

      let realIP = '';
      if (typeof xForwardedFor === 'string') {
        realIP = xForwardedFor.split(',')[0].trim(); // First Ip extract grana lako!!
      } else {
        realIP =
          req.headers['x-real-ip']?.[0] || req.connection.remoteAddress || '';
      }
      

      return realIP.replace(/^::ffff:/, ''); // Optional: To remove IPv6 prefix if IPv4 is neeeded
    },
  });

  use(req: Request, res: Response, next: NextFunction): void {

    this.limiter(req, res, next);
  }
}
