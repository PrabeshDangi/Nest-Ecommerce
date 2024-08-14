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
import { CategoryService } from './category.service';
import { JwtGuard } from '../auth/Guard/Jwt.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { addCategoryDto } from './dto/addcategory.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get('getcategories')
  getCategories(@Req() req, @Res() res) {
    return this.categoryService.getCategories(req, res);
  }

  @Post('addcategory')
  addCategory(@Body() addcaetegorydto: addCategoryDto, @Req() req, @Res() res) {
    return this.categoryService.addCategory(addcaetegorydto, req, res);
  }

  @Post('deletecategory/:id')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.categoryService.deleteCategory(id, req, res);
  }

  @Post('updatecategory/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedto: addCategoryDto,
    @Req() req,
    @Res() res,
  ) {
    return this.categoryService.updateCategory(id, updatedto, req, res);
  }
}
