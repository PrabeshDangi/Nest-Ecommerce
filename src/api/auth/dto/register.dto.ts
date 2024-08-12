import { UserRole } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator'

export class SignupDto{
    @IsString()
    @Length(3,20)
    @IsNotEmpty()
    name:string

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid format' })
    @IsNotEmpty()
    phone:string

    @IsOptional()
    role?:UserRole

    @IsNotEmpty()
    @IsString()
    @Length(6, 100,{message:"password must be of minimum length 6"}) 
    password:string
}