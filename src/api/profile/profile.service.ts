import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { updateDto } from './dto/updateProfile.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/global/prisma/prisma.service';
import { forgotPasswordDTO } from './dto/forgotPassword.dto';
import { HelperService } from 'src/common/helper/helper.service';
import { EmailService } from 'src/global/email/email.service';
import { templateBuilder } from 'src/global/email/Templates/forgotpassword.template';
import { resetPasswordDTO } from './dto/resetPassword.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelperService,
    private emailService: EmailService,
  ) {}

  async getMyProfile(req: Request, res: Response) {
    const user = req.user as { id: number; email: string };
    if (!user) {
      throw new BadRequestException('No user!!');
    }

    const availableUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    return res.status(200).json({
      message: 'Profile fetched successfully!!',
      user: availableUser,
    });
  }

  async updateProfile(updatedto: updateDto, req: Request, res: Response) {
    const user = req.user as { id: number; email: string };
    const userAvailable = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!userAvailable) {
      throw new ForbiddenException('User not authorized!!');
    }

    const updatedUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: updatedto.name,
        phone: updatedto.phone,
      },
    });
    return res.status(200).json({
      message: 'User updated successfully!!',
      data: updatedUser,
    });
  }

  async changePassword(
    changepassworddto: changePasswordDto,
    req: Request,
    res: Response,
  ) {
    const { currentPassword, newpassword } = changepassworddto;
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const userAvailable = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (currentPassword === newpassword) {
      throw new BadRequestException('New and old password cannot be same!!');
    }

    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      userAvailable.password,
    );

    if (!isPasswordCorrect) {
      throw new BadRequestException('Invalid password');
    }
    const hashedpassword = await bcrypt.hash(newpassword, 10);

    await this.prisma.user.update({
      where: {
        id: userAvailable.id,
      },
      data: {
        password: hashedpassword,
      },
    });

    return res.status(200).json({
      message: 'Password changed successfully!!',
    });
  }

  async forgotPassword(dto: forgotPasswordDTO, res: Response) {
    const { email } = dto;

    const userAvailable = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!userAvailable) {
      throw new NotFoundException('User not registered!!');
    }

    const otp = parseInt(await this.helperService.generateOtp());
    const otpExpiration = new Date(Date.now() + 120000);

    const emailTemplate = await templateBuilder(userAvailable.name, email, otp);

    await this.emailService.sendEmail(emailTemplate, res);

    await this.prisma.passwordReset.create({
      data: {
        userId: userAvailable.id,
        otp,
        expiresAt: otpExpiration,
      },
    });

    return res.status(200).json({
      message: 'Password reset email sent successfully!!',
    });
  }
  async resetPassword(resetpassworddto: resetPasswordDTO, res: Response) {
    const { otp, password } = resetpassworddto;

    const otpAvailable = await this.prisma.passwordReset.findUnique({
      where: {
        otp,
      },
    });

    if (!otpAvailable || otpAvailable.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP!!');
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: {
        id: otpAvailable.userId,
      },
      data: {
        password: hashedpassword,
      },
    });

    await this.prisma.passwordReset.delete({
      where: {
        otp,
      },
    });

    return res.status(200).json({
      message: 'Password reset successfully!!',
    });
  }
}
