import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDTO {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  streetaddress: string;

  @IsString()
  @IsNotEmpty()
  postalcode: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
