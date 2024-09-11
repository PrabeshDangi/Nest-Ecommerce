import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatDTO {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
