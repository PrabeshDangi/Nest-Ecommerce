import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { Size } from '@prisma/client';

// export class CategoryDto {
//   @IsNumber()
//   id: number;

//   @IsOptional()
//   name?: string; // Optional if we are using ids for connecting existing categories
// }

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  image?: string[];

  @IsOptional()
  discounttag?: boolean;

  @IsNotEmpty()
  rating: number;

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
}
