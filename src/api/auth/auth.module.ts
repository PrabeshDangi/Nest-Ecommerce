import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { EmailModule } from 'src/global/email/email.module';
import { AtStrategy, RtStrategy } from './Strategies';

@Module({
  imports: [
    PrismaModule,
    EmailModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_EXPIRY },
    }),
    JwtModule.register({
      secret: process.env.REFRESH_SECRET,
      signOptions: { expiresIn: process.env.REFRESH_EXPIRY },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, RtStrategy, AtStrategy, PrismaService],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
