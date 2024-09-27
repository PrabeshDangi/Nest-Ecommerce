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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateServiceDTO } from './dto/createservice.dto';
import { UpdateServiceDTO } from './dto/updateservice.dto';
import { JwtGuard } from 'src/api/auth/Guard/Access.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  async getServices() {
    try {
      return await this.servicesService.getServices();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('icon'))
  @Post()
  async createService(
    @UploadedFile() file: Express.Multer.File,
    @Body() createservicedto: CreateServiceDTO,
  ) {
    try {
      return await this.servicesService.createService(file, createservicedto);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('icon'))
  @Patch(':id')
  async updateService(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateservicedto: UpdateServiceDTO,
  ) {
    try {
      return await this.servicesService.updateService(
        file,
        id,
        updateservicedto,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteService(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.servicesService.deleteService(id);
    } catch (error) {
      console.log(error);

      throw error;
    }
  }
}
