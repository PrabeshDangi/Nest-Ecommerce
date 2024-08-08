import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator"

export class updateDto{
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name :string

    @IsString()
    @IsOptional()
    @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Phone number must be a valid format' })
    @IsNotEmpty()
    phone:string
}