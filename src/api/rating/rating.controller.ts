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
import { RatingService } from './rating.service';
import { createRatingDTO } from './dto/create-rating.dto';
import { JwtGuard } from '../auth/Guard/Jwt.guard';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';
import { updateRatingDTO } from './dto/update-rating.dto';
import { Public } from 'src/common/decorator/public.decorator';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.User)
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Public()
  @Get(':id')
  getRating(@Param('id', ParseIntPipe) id: number) {
    return this.ratingService.getRating(id);
  }

  @Post('create/:id')
  createRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() createratingdto: createRatingDTO,
    @Req() req,
    @Res() res,
  ) {
    return this.ratingService.createRating(id, createratingdto, req, res);
  }

  @Patch(':id')
  updateRating(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateratingdto: updateRatingDTO,
    @Req() req,
    @Res() res,
  ) {
    return this.ratingService.updateRating(id, updateratingdto, req, res);
  }

  @Delete(':id')
  deleteRating(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.ratingService.deleteRating(id, req);
  }
}
