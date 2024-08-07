import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/Guard/Jwt.strategy';

@Module({
  imports:[AuthModule,DatabaseModule],
  controllers: [ProfileController],
  providers: [ProfileService,JwtStrategy],
})
export class ProfileModule {}
