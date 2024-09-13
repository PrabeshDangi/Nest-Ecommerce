import { IsNotEmpty } from 'class-validator';

export class InitializePaymentDTO {
  @IsNotEmpty()
  itemId: number[];

  @IsNotEmpty()
  totalPrice: number;
}
