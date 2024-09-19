import { IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateInvoiceDTO } from './create-invoice.dto';
import { Type } from 'class-transformer';

export class InitPaymentDTO {
  @IsNotEmpty()
  itemId: number[];

  @IsNotEmpty()
  totalPrice: number;

  @ValidateNested() 
  @Type(() => CreateInvoiceDTO)
  billingInfo: CreateInvoiceDTO;
}
