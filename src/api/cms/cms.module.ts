import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { ServicesModule } from './services/services.module';
import { StatisticsModule } from './statistics/statistics.module';
import { StorycontentModule } from './storycontent/storycontent.module';

@Module({
  imports: [
    EmployeeModule,
    ServicesModule,
    StatisticsModule,
    StorycontentModule,
  ],
})
export class CmsModule {}
