import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorators';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.User)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get('mylist')
  getMyWishlist(@Req() req, @Res() res) {
    return this.wishlistService.getMyWishlist(req, res);
  }

  @Post('add/:id')
  addToList(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res) {
    return this.wishlistService.addToList(id, req, res);
  }

  @Post('deleteall')
  deleteAllFromList(@Req() req, @Res() res) {
    return this.wishlistService.deleteAllFromList(req, res);
  }

  @Post('delete/:id')
  deleteFromList(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.wishlistService.deleteFromList(id, req, res);
  }
}
