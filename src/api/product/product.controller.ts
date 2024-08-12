import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createproduct.dto';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Role } from 'src/common/enums/role.enum';

import { UpdateProductDto } from './dto/updateproduct.dto';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard,RolesGuard)
@Roles(Role.Admin)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  
  ) {}

  @Public()
  @Get('allproducts')
  getAllProducts(@Req() req){
    return this.productService.getAllProducts(req);
  }

  @Public()
  @Get('productdetail/:id')
  getProduct(@Param('id',ParseIntPipe) id:number,@Res() res){
    return this.productService.getProduct(id,res)
  }

  @Post('addproduct')
  addProduct(@Body() createproductdto:CreateProductDto,@Req() req,@Res() res){
    return this.productService.addProduct(createproductdto,req,res)
  }

  @Post('updateproduct/:id')
  updateProduct(@Param() id:number,@Body() updateproductdto:UpdateProductDto, @Req() req,@Res() res){
    return this.productService.updateProduct(id,updateproductdto,req,res)
  }


  @Post('deleteproduct/:id')
  deleteProduct(@Param('id',ParseIntPipe) id:number,@Req() req,@Res() res ){
    return this.productService.deleteProduct(id,req,res)
  }


}
