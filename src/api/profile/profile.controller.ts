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
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/api/auth/Guard/Access.guard';
import { updateDto } from './dto/updateProfile.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';
import { Public } from 'src/common/decorator/public.decorator';
import { resetPasswordDTO } from './dto/resetPassword.dto';
import { RolesGuard } from '../auth/Guard/role.guard';
import { Roles } from 'src/common/decorator/roles.decorators';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getMyProfile(@Req() req, @Res() res) {
    return this.profileService.getMyProfile(req, res);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Get('users')
  getUsers(@Req() req, @Res() res) {
    return this.profileService.getUsers(req, res);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.profileService.deleteUser(id, req);
  }

  @Patch('updateprofile')
  updateProfile(@Body() updatedto: updateDto, @Req() req, @Res() res) {
    return this.profileService.updateProfile(updatedto, req, res);
  }

  @Patch('changepassword')
  changePassword(
    @Body() changepassworddto: changePasswordDto,
    @Req() req,
    @Res() res,
  ) {
    return this.profileService.changePassword(changepassworddto, req, res);
  }

  @Public()
  @Post('forgotpassword')
  forgotPassword(@Body() forgotpassworddto: forgotPasswordDTO, @Res() res) {
    return this.profileService.forgotPassword(forgotpassworddto, res);
  }

  @Public()
  @Post('resetpassword')
  resetPassword(@Body() resetpassworddto: resetPasswordDTO, @Res() res) {
    return this.profileService.resetPassword(resetpassworddto, res);
  }
}
