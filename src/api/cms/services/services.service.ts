import {
  BadRequestException,
  Body,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { ImageUploadService } from 'src/global/services/imageupload.service';
import { CreateServiceDTO } from './dto/createservice.dto';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private uploadImageService: ImageUploadService,
  ) {}

  async getServices() {
    const services = await this.prisma.service.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        icon: true,
      },
    });

    if (services.length === 0) {
      throw new NotFoundException('No services found!!');
    }

    return services;
  }

  async createService(
    file: Express.Multer.File,
    @Body() createservicedto: CreateServiceDTO,
  ) {
    const { title, description } = createservicedto;

    if (!file) {
      throw new BadRequestException(' Image file is required');
    }

    const iconurl=await this.uploadImageService.uploadImage(file);

    if(iconurl){
        throw new BadRequestException("Image uploading error!!")
    }

    const newService=await this.prisma.service.create({
        data:{
            title,
            description,
            icon:iconurl
        }
    })
    return newService
  }
}
