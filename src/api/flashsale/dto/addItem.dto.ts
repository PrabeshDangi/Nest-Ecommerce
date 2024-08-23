import { IsNotEmpty, IsOptional } from 'class-validator';

export class addItemDto {
  @IsNotEmpty()
  saleStart: string;

  @IsNotEmpty()
  saleEnd: string;
}
