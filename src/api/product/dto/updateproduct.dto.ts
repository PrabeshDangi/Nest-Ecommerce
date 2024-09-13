import { Size } from '@prisma/client';
import { IsOptional } from 'class-validator';

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
  sizes?: Size | null;

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
