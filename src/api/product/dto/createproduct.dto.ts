import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Size } from 'src/common/enums/size.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  price: number;

  image: string[];

  @IsOptional()
  discounttag?: string;

  @IsOptional()
  discountprice?: number;

  @IsOptional()
  sizes?: Size | null;

  @IsString()
  returnpolicy: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsOptional()
  availability?: string;

  @IsNotEmpty()
  categories: string;

  @IsNotEmpty()
  stock: number;
}
