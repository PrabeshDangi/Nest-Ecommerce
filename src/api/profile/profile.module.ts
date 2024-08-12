import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { JwtStrategy } from 'src/api/auth/Guard/Jwt.strategy';
import { PrismaModule } from 'src/global/prisma/prisma.module';

@Module({
  imports:[AuthModule,PrismaModule],
  controllers: [ProfileController],
  providers: [ProfileService,JwtStrategy],
})
export class ProfileModule {}
