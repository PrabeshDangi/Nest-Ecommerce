import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class UpdateFlashDto {
  @IsDate()
  @Type(() => Date)
  saleStart: Date;

  @IsDate()
  @Type(() => Date)
  saleEnd: Date;

  @IsNumber()
  discountprice: number;
}
