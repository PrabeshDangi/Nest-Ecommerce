import { IsNotEmpty, IsNumber } from 'class-validator';

export class addProductDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;
}
