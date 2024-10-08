import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtGuard } from '../auth/Guard/Access.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { Public } from 'src/common/decorator/public.decorator';
import { AddCategoryDto } from './dto/addcategory.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Public()
  @Get()
  getCategories(@Req() req, @Res() res) {
    return this.categoryService.getCategories(req, res);
  }

  @Post('add')
  addCategory(@Body() addcaetegorydto: AddCategoryDto, @Req() req, @Res() res) {
    return this.categoryService.addCategory(addcaetegorydto, req, res);
  }

  @Delete('/:id')
  deleteCategory(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    @Res() res,
  ) {
    return this.categoryService.deleteCategory(id, req, res);
  }

  @Patch('update/:id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatedto: AddCategoryDto,
    @Req() req,
    @Res() res,
  ) {
    return this.categoryService.updateCategory(id, updatedto, req, res);
  }
}
