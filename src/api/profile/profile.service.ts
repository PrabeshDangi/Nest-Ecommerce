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

  async getUsers(req: Request, res: Response) {
    const user = req.user as { id: number; email: string };

    if (!user) {
      throw new ForbiddenException('User not authorized!!');
    }

    const usersAvailable = await this.prisma.user.findMany();

    if (usersAvailable.length === 0) {
      return res.status(404).json({
        message: 'No users found!!',
      });
    }

    return res.status(200).json({
      message: 'Users fetched successfully!!',
      data: usersAvailable,
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
      where: { email },
      select: { id: true, name: true },
    });

    if (!userAvailable) {
      throw new NotFoundException('User not registered!!');
    }

    const otp = await this.helperService.generateOtp();
    const otpExpiration = new Date(Date.now() + 120000);
    const otpHash = await bcrypt.hash(otp, 10);

    const existingOtp = await this.prisma.passwordReset.findFirst({
      where: {
        userId: userAvailable.id,
      },
    });

    if (existingOtp) {
      await this.prisma.passwordReset.update({
        where: { id: existingOtp.id },
        data: {
          otpHash,
          expiresAt: otpExpiration,
        },
      });
    } else {
      await this.prisma.passwordReset.create({
        data: {
          userId: userAvailable.id,
          otpHash,
          expiresAt: otpExpiration,
        },
      });
    }

    const emailTemplate = await templateBuilder(userAvailable.name, email, otp);
    await this.emailService.sendEmail(emailTemplate, res);

    return res
      .status(200)
      .json({ message: 'Password reset email sent successfully!!' });
  }

  async resetPassword(resetpassworddto: resetPasswordDTO, res: Response) {
    const { otp, password } = resetpassworddto;

    const otpAvailable = await this.prisma.passwordReset.findMany({
      where: {
        expiresAt: { gt: new Date() },
      },
    });

    if (!otpAvailable) {
      throw new BadRequestException('No valid otp!!');
    }

    let matchingOtpRecord = null;

    for (const record of otpAvailable) {
      const isValidOtp = await bcrypt.compare(otp, record.otpHash);
      if (isValidOtp) {
        matchingOtpRecord = record;
        break;
      }
    }

    if (!matchingOtpRecord) {
      throw new BadRequestException('Invalid Otp!!');
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await this.prisma.user.update({
      where: {
        id: matchingOtpRecord.userId,
      },
      data: {
        password: hashedpassword,
      },
    });

    await this.prisma.passwordReset.delete({
      where: {
        id: matchingOtpRecord.id,
      },
    });

    return res.status(200).json({
      message: 'Password reset successfully!!',
    });
  }
}
