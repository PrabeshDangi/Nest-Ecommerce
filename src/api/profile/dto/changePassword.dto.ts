import { IsNotEmpty, IsString, Length } from "class-validator";

export class changePasswordDto{

    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 100,{message:"password must be of minimum length 6"})
    newpassword:string
}