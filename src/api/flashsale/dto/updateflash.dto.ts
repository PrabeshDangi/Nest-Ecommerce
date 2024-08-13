import { Type } from "class-transformer";
import { IsOptional, IsDate, IsNumber } from "class-validator";


export class UpdateFlashDto {
    @IsDate()
    @Type(() => Date)
    saleStart: Date;
  
    @IsDate()
    @Type(() => Date)
    saleEnd: Date;

    @IsNumber()
    discountprice:number
  }