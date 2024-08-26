import { IsNotEmpty } from 'class-validator';

export class forgotPasswordDTO {
  @IsNotEmpty()
  email: string;
}
