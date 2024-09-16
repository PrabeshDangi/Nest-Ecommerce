// import { Request, Response, NextFunction } from 'express';
// import rateLimit from 'express-rate-limit';
// import redisRateLimit from 'rate-limit-redis';
// import redisClient from '../config/redisconfig';

// const limiter = rateLimit({
//   store: new redisRateLimit({
//     sendCommand: (...args) => redisClient.sendCommand(args),
//     resetExpiryOnChange: true,
//   }),
//   limit: 100,
//   message: 'Too many requests from this IP, please try again later',
//   keyGenerator: (req: Request) => {
//     return (
//       req.connection.remoteAddress || (req.headers['x-forwarded-for'] as string)
//     );
//   },
//   windowMs: 60 * 60 * 1000,
// });

// export const rateLimiterMiddleware = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   return limiter(req, res, next);
// };

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import redisRateLimit from 'rate-limit-redis';
import redisClient from '../config/redisconfig';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    store: new redisRateLimit({
      sendCommand: (...args) => redisClient.sendCommand(args),
      resetExpiryOnChange: true,
    }),
    limit: 100,
    message: 'Too many requests from this IP, please try again later',
    keyGenerator: (req: Request) => {
      console.log(req.headers['x-forwarded-for'] as string);
      
      return (
        req.connection.remoteAddress ||
        (req.headers['x-forwarded-for'] as string)
      );
    },
    windowMs: 60 * 60 * 1000,
  });

  use(req: Request, res: Response, next: NextFunction): void {
    console.log('Applyng rate limiter!!');

    this.limiter(req, res, next);
  }
}
