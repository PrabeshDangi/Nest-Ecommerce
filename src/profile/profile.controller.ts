import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { DatabaseService } from 'src/database/database.service';
import { JwtGuard } from 'src/auth/Guard/Jwt.guard';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private prisma:DatabaseService
  ) {}

  @UseGuards(JwtGuard)
  @Get('myprofile')
  getMyProfile(@Req() req, @Res() res){
    
    return this.profileService.getMyProfile(req,res)
  }

}

