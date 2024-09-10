import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
