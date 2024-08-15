import { IsNotEmpty } from 'class-validator';

export class addItemDto {
  @IsNotEmpty()
  productId: number;
}
