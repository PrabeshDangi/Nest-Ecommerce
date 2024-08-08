import { Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/Guard/Jwt.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/Guard/role.guard';


 //@Roles(['admin','user'])

@UseGuards(JwtGuard,RolesGuard)
@Roles(Role.User)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  
  @Get('mycart')
  getMyCart(@Res() res, @Req() req){
    return this.cartService.getMyCart(req, res)
  }


  @Post('deleteproduct/:id')
  deleteProductFromCart(@Param('id', ParseIntPipe)id:number,@Req() req, @Res() res){
    return this.cartService.deleteProductFromCart(id,req,res);
  }

  @Post('deleteall')
  deleteAllItems(@Req() req, @Res() res){
    return this.cartService.deleteAllItems(req,res)
  }
}
