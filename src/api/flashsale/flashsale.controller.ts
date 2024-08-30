import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FlashsaleService } from './flashsale.service';
import { Public } from 'src/common/decorator/public.decorator';
import { JwtGuard } from '../auth/Guard/Jwt.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { AddFlashDto } from './dto/addItem.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('sale')
export class FlashsaleController {
  constructor(private readonly flashsaleService: FlashsaleService) {}

  @Public()
  @Get()
  getAllFlashItems() {
    return this.flashsaleService.getAllFlashItems();
  }

  @Post('additem')
  addItemToFlash(@Body() addflashdto: AddFlashDto, @Req() req, @Res() res) {
    return this.flashsaleService.addItemToFlash(addflashdto, req, res);
  }

  @Delete('/:id')
  deleteItemFromFlash(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.flashsaleService.deleteItemFromFlash(id, req, res);
  }

  @Delete()
  deleteAllItemsFromFlash(@Req() req, @Res() res) {
    return this.flashsaleService.deleteAllItemsFromFlash(req, res);
  }
}
