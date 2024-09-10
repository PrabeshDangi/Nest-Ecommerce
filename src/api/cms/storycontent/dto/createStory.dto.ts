import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStoryDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  image: string;
}
