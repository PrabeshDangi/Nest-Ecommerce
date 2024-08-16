import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtGuard } from 'src/api/auth/Guard/Jwt.guard';
import { updateDto } from './dto/updateProfile.dto';
import { changePasswordDto } from './dto/changePassword.dto';

@UseGuards(JwtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getMyProfile(@Req() req, @Res() res) {
    return this.profileService.getMyProfile(req, res);
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
}
