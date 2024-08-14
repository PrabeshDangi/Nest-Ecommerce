import { IsString } from 'class-validator';

export class addCategoryDto {
  @IsString()
  name: string;
}
