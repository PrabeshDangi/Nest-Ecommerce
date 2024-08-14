import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Size } from '@prisma/client';

export class CategoryDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string; // Optional if you are using ids for connecting existing categories
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  image: string[];

  @IsOptional()
  discounttag?: boolean;

  @IsNotEmpty()
  rating: number;

  @IsOptional()
  discountprice?: number;

  @IsOptional()
  @IsEnum(Size)
  sizes?: string; // If Size is an enum, use @IsEnum(Size) instead

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
}
