import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { CreateStoryDTO } from './dto/createStory.dto';
import { ImageUploadService } from 'src/global/services/imageupload.service';
import { UpdateStoryDTO } from './dto/updatestory.dto';

@Injectable()
export class StorycontentService {
  constructor(
    private prisma: PrismaService,
    private uploadImage: ImageUploadService,
  ) {}

  async getStory() {
    const story = await this.prisma.storycontent.findFirst();

    if (!story) {
      throw new NotFoundException('Story content not found!!');
    }

    return story;
  }

  async createStroy(file: Express.Multer.File, createstorydto: CreateStoryDTO) {
    const { title, body } = createstorydto;
    const contentAvailable = await this.prisma.storycontent.findFirst();

    if (!file) {
      throw new BadRequestException('At least one image file is required');
    }

    const imageUrl = await this.uploadImage.uploadImage(file);

    if (!contentAvailable) {
      const storycontent = await this.prisma.storycontent.create({
        data: {
          title,
          body,
          image: imageUrl,
        },
      });
      return storycontent;
    }

    const storycontent = await this.prisma.storycontent.update({
      where: { id: contentAvailable.id },
      data: {
        title,
        body,
        image: imageUrl,
      },
    });

    return storycontent;
  }

  async updateStory(file: Express.Multer.File, updatestorydto: UpdateStoryDTO) {
    const { title, body} = updatestorydto;
    const content = await this.prisma.storycontent.findFirst();

    const updateData: any = {
      title: title || content.title,
      body: body || content.body,
    };

    if (file) {
      const imageUrl = await this.uploadImage.uploadImage(file);
      updateData.image = imageUrl;
    } 

    if (!content) {
      throw new NotFoundException('Story content not found!!');
    }

    const updatedStory = await this.prisma.storycontent.update({
      where: { id: content.id },
      data: updateData,
    });
    return updatedStory;
  }




}
