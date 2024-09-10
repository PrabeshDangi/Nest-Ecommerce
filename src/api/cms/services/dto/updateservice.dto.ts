import { IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  
}
