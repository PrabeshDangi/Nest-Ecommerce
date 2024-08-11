import { Body, Controller, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/createproduct.dto';
import { JwtGuard } from 'src/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/auth/Guard/role.guard';
import { Roles } from 'src/decorators/roles.decorators';
import { Role } from 'src/enums/role.enum';
import { UpdateProductDto } from './dto/updateproduct.dto';

@UseGuards(JwtGuard,RolesGuard)
@Roles(Role.Admin)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  
  ) {}

  @Post('addproduct')
  addProduct(@Body() createproductdto:CreateProductDto,@Req() req,@Res() res){
    return this.productService.addProduct(createproductdto,req,res)
  }

  @Post('updateproduct/:id')
  updateProduct(@Param() id:number,@Body() updateproductdto:UpdateProductDto, @Req() req,@Res() res){
    return this.productService.updateProduct(id,updateproductdto,req,res)
  }


}
