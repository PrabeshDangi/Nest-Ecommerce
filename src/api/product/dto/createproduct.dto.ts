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
  discounttag?: boolean;

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
  availability?: boolean;

  @IsOptional()
  categories: string;

  @IsNotEmpty()
  stock: number;
}
