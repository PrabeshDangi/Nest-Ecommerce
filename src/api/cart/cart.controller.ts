import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorator/roles.decorators';

//@Roles(['admin','user'])

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.User)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getMyCart(@Res() res, @Req() req) {
    return this.cartService.getMyCart(req, res);
  }

  @Post(':id')
  addToCart(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type: string,
    @Req() req,
    @Res() res,
  ) {
    return this.cartService.addItem(id, type, req, res);
  }

  @Delete('delete/:id')
  deleteProductFromCart(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.cartService.deleteProductFromCart(id, req, res);
  }

  @Delete('deleteall')
  deleteAllItems(@Req() req, @Res() res) {
    return this.cartService.deleteAllItems(req, res);
  }
}
