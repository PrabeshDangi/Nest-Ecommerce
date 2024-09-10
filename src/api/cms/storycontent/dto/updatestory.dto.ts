import { IsOptional, IsString } from 'class-validator';

export class UpdateStoryDTO {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
