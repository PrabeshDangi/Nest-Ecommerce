import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { updateDto } from './dto/updateProfile.dto';
import { changePasswordDto } from './dto/changePassword.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class ProfileService {
    constructor(private prisma:DatabaseService){}

    async getMyProfile(req:Request,res:Response){
        const user=req.user as { id: number; email: string };
        if(!user){
            throw new BadRequestException("No user!!")
        }

        const availableUser=await this.prisma.user.findUnique({
            where:{
                id:user.id
            },
            select:{
                name:true,
                email:true,
                role:true,
                phone:true
            }
        })
        
       return res.status(200).json({
        message:"Profile fetched successfully!!",
        user:availableUser
       })
    }

    async updateProfile(updatedto:updateDto,req:Request,res:Response){
        const user=req.user as { id: number; email: string };
        const userAvailable=await this.prisma.user.findUnique({
            where:{
                id:user.id
            }
        })

        if(!userAvailable){
            throw new ForbiddenException("User not authorized!!")
        }

        const updatedUser=await this.prisma.user.update({
            where:{
                id:user.id
            },
            data:{
                name:updatedto.name,
                phone:updatedto.phone
            }
        })
        return res.status(200).json({
            message:"User updated successfully!!",
            data:updatedUser
        })
    }

    async changePassword(changepassworddto:changePasswordDto,req:Request,res:Response){
        const {currentPassword,newpassword}=changepassworddto;
        const user=req.user as { id: number; email: string };

        if(!user){
            throw new ForbiddenException("User not authorized!!");
        }

        const userAvailable=await this.prisma.user.findUnique({
            where:{
                id:user.id
            }
        })
        if(currentPassword===newpassword){
            throw new BadRequestException("New and old password cannot be same!!")
        }

        const isPasswordCorrect=await bcrypt.compare(currentPassword,userAvailable.password);

        if(!isPasswordCorrect){
            throw new BadRequestException("Invalid password")
        }
        const hashedpassword=await bcrypt.hash(newpassword,10);

        await this.prisma.user.update({
            where:{
                id:userAvailable.id
            },
            data:{
                password:hashedpassword
            }
        })

        return res.status(200).json({
            message:"Password changed successfully!!"
        })


    }
}

