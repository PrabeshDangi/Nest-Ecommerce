import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Size } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  image?: string[];

  @IsOptional()
  discounttag?: boolean;

  @IsOptional()
  discountprice?: number;

  @IsOptional()
  @IsEnum(Size)
  sizes?: Size;

  @IsString()
  returnpolicy: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsNotEmpty()
  availability: boolean;

  @IsOptional()
  categories: string;

  @IsNotEmpty()
  stock: number;
}
