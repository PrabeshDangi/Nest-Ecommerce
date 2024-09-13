import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/createproduct.dto';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { RolesGuard } from 'src/api/auth/Guard/role.guard';
import { Role } from 'src/common/enums/role.enum';

import { UpdateProductDto } from './dto/updateproduct.dto';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Public } from 'src/common/decorator/public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  
  
  @Public()
  @Get()
  searchProduct(@Query('q') sstring: string) {
    return this.productService.searchProduct(sstring);
  }



  @Public()
  @Get('newarrival')
  getNewArrival() {
    return this.productService.getNewArrival();
  }

  @Public()
  @Get('category/:id')
  getProductsByCategoryId(@Param('id', ParseIntPipe) id: number, @Res() res) {
    return this.productService.getProductsByCategoryId(id, res);
  }

  @Public()
  @Get('bestselling')
  getBestSellingProducts(@Res() res) {
    return this.productService.getBestSellingProducts(res);
  }

  @Public()
  @Get('all')
  getAllProducts(@Res() res) {
    return this.productService.getAllProducts(res);
  }

  @Public()
  @Get('/:id')
  getProduct(@Param('id', ParseIntPipe) id: number, @Res() res) {
    return this.productService.getProduct(id, res);
  }

  @Post('create')
  @UseInterceptors(FilesInterceptor('image'))
  addProduct(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createproductdto: CreateProductDto,
    @Req() req,
    @Res() res,
  ) {
    console.log(createproductdto.sizes);
    return this.productService.addProduct(files, createproductdto, req, res);
  }

  @Patch('/:id')
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateproductdto: UpdateProductDto,
    @Req() req,
    @Res() res,
  ) {
    return this.productService.updateProduct(id, updateproductdto, req, res);
  }

  @Delete('/:id')
  deleteProduct(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res) {
    return this.productService.deleteProduct(id, req, res);
  }

  @Patch('updateimage/:id')
  @UseInterceptors(FilesInterceptor('image'))
  updateProductImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
    @Res() res,
  ) {
    return this.productService.updateProductImage(id, files, req, res);
  }

  @Patch('addimage/:id')
  @UseInterceptors(FilesInterceptor('image'))
  addProductImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req,
    @Res() res,
  ) {
    return this.productService.addProductImage(id, files, req, res);
  }

  @Delete('deleteimages/:id')
  deleteImages(@Param('id', ParseIntPipe) id: number, @Req() req, @Res() res) {
    return this.productService.deleteImages(id, req, res);
  }

  @Delete('deleteimage/:id')
  deleteImage(
    @Body() body: { index: number },
    @Param('id', ParseIntPipe) id: number,
    @Res() res,
  ) {
    return this.productService.deleteImage(body, id, res);
  }

 
}
