import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { addItemDto } from './dto/additem.dto';
import { JwtGuard } from '../auth/Guard/Jwt.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Public()
  @Get('getitems')
  getBannerItems(@Res() res) {
    return this.bannerService.getBannerItem(res);
  }

  @Post('additem/:id')
  addBannerItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() addItemdto: addItemDto,
    @Req() req,
    @Res() res,
  ) {
    return this.bannerService.addBannerItem(id, addItemdto, req, res);
  }

  @Post('deleteitem/:id')
  deleteItem(
    @Body() deletedto: addItemDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.bannerService.deleteItem(deletedto, id, req, res);
  }
}
