import { Size } from '@prisma/client';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  discounttag?: boolean;

  @IsOptional()
  discountprice?: number;

  @IsOptional()
  @IsEnum(Size)
  sizes?: Size;

  @IsOptional()
  returnpolicy?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  brand?: string;

  @IsOptional()
  availability?: boolean;

  @IsOptional()
  categories?: string;

  @IsOptional()
  stock?: number;
}
