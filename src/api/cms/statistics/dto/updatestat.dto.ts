import { IsOptional, IsString } from 'class-validator';

export class UpdateStatDTO {
  @IsOptional()
  @IsString()
  value?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
