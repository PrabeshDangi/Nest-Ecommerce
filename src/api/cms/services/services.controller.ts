import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateServiceDTO } from './dto/createservice.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async getServices() {
    try {
      return await this.servicesService.getServices();
    } catch (error) {
      throw new Error(error);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('icon'))
  @Post()
  async createService(
    file: Express.Multer.File,
    @Body() createservicedto: CreateServiceDTO,
  ) {
    try {
      return await this.servicesService.createService(file, createservicedto);
    } catch (error) {
      throw new Error(error);
    }
  }

  // @HttpCode(HttpStatus.OK)
  // @UseInterceptors(FileInterceptor('icon'))
  // @Patch()
  // async updateService(
  //   file: Express.Multer.File,
  //   @Body() updateservicedto: CreateServiceDTO,
  // ) {
  //   try {
  //     return await this.servicesService.updateService(file, updateservicedto);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }

  // @HttpCode(HttpStatus.OK)
  // @Delete()
  // async deleteService(@Query('id', ParseIntPipe) id: number) {
  //   try {
  //     return await this.servicesService.deleteService(id);
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}
