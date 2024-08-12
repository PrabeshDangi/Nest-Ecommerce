import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './Guard/Jwt.strategy';

// @Module({

//   imports:[
//     DatabaseModule,
//     PassportModule.register({ defaultStrategy: 'jwt' }),
//     JwtModule.register({
//       secret: 'your-jwt-secret',
//       signOptions: { expiresIn: '1h' },
//     })
//   ],
//   controllers: [AuthController],
//   providers: [AuthService],
// })

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtsecret'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRATION') },
      }),
    }),
  ], 
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService ],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
