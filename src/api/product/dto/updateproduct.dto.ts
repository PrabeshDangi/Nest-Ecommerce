import { Size } from '@prisma/client';
import { IsOptional, IsEnum } from 'class-validator';
import { CategoryDto } from './createproduct.dto';

export class UpdateProductDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  price?: number;

  @IsOptional()
  image?: string[];

  @IsOptional()
  discounttag?: boolean;

  @IsOptional()
  rating?: number;

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
  categories?: CategoryDto[];
}
