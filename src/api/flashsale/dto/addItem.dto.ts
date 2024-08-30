import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class AddFlashDto {
  @IsDate()
  @Type(() => Date)
  saleStart: Date;

  @IsDate()
  @Type(() => Date)
  saleEnd: Date;

  @IsNotEmpty()
  products: number[];
}
