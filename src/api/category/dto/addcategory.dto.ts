import { IsString, Matches } from 'class-validator';

export class AddCategoryDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'Name can only contain letters, numbers, and spaces',
  })
  name: string;
}
