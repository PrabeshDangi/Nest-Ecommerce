import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
