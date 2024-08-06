import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { SignupDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private prisma:DatabaseService){}

    async SignupUser(signupdto:SignupDto){
        const {name,email,phone,password}=signupdto;

        const isUserAvailable=await this.prisma.user.findUnique({where:{email}})

        if(isUserAvailable){
            throw new BadRequestException('Email already registered!!')
        }

        const hashedpassword=await this.hashPassword(password);

        const newuser=await this.prisma.user.create({
            data:{
                name,
                email,
                password:hashedpassword,
                phone
            }
        })

        return {
            message:"New user created successfully!!",
            data:newuser
        }

    }

    async hashPassword(password:string){
        const saltRound=10;
        return await bcrypt.hash(password,saltRound)
    }
    
}
