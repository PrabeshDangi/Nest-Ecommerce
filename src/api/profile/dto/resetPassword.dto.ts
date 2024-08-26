import { IsNotEmpty, Length } from 'class-validator';

export class resetPasswordDTO {
  @IsNotEmpty()
  otp: number;

  @IsNotEmpty()
  @Length(6, 25, { message: 'password must be of minimum length 6' })
  password: string;
}
