import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import config from './config/config';


@Module({
  imports: [AuthModule,ConfigModule.forRoot({
    isGlobal:true,
    cache:true,
    load:[config]

  }), DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
