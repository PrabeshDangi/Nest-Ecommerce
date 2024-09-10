import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  twitter?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  image: string;
}
