import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/api/auth/auth.module';
import { PrismaModule } from 'src/global/prisma/prisma.module';
import { EmailModule } from 'src/global/email/email.module';
import { HelperService } from 'src/common/helper/helper.service';
import { AtStrategy, RtStrategy } from '../auth/Strategies';

@Module({
  imports: [AuthModule, PrismaModule, EmailModule],
  controllers: [ProfileController],
  providers: [ProfileService, RtStrategy, AtStrategy, HelperService],
})
export class ProfileModule {}
