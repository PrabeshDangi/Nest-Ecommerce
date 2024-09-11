import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { CreateStatDTO } from './dto/createstat.dto';
import { UpdateStatDTO } from './dto/updatestat.dto';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  async getStat() {
    try {
      return await this.statisticsService.getStat();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createStat(@Body() createStatdto: CreateStatDTO) {
    try {
      return await this.statisticsService.createStat(createStatdto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateStat(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatestatdto: UpdateStatDTO,
  ) {
    try {
      return await this.statisticsService.updateStat(id, updatestatdto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteStat(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.statisticsService.deleteStat(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
