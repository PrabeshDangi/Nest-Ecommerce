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
import { addProductDto } from './dto/addproduct.dto';
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
  @Get('items')
  getBannerItems(@Res() res) {
    return this.bannerService.getBannerItems(res);
  }

  @Post('additem/:id')
  addItemToBanner(
    @Param('id', ParseIntPipe) id: number,
    @Body() addproddto: addProductDto,
    @Req() req,
    @Res() res,
  ) {
    console.log('Userrrrrrrrrrr');
    return this.bannerService.addItemToBanner(id, addproddto, req, res);
  }

  @Public()
  @Get('gethello')
  getHello(@Req() req, @Res() res) {
    return this.bannerService.getHello(req, res);
  }
}
