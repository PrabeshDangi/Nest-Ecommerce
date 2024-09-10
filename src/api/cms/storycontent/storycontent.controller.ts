import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StorycontentService } from './storycontent.service';
import { CreateStoryDTO } from './dto/createStory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStoryDTO } from './dto/updatestory.dto';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('storycontent')
export class StorycontentController {
  constructor(private readonly storycontentService: StorycontentService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  async getStory() {
    try {
      return await this.storycontentService.getStory();
    } catch (error) {
      throw new Error(error);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createStory(
    @UploadedFile() file: Express.Multer.File,
    @Body() createstorydto: CreateStoryDTO,
  ) {
    try {
      return await this.storycontentService.createStroy(file, createstorydto);
    } catch (error) {
      throw new Error(error);
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async updateStory(
    @UploadedFile() file: Express.Multer.File,
    @Body() updatestorydto: UpdateStoryDTO,
  ) {
    try {
      return await this.storycontentService.updateStory(file, updatestorydto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
