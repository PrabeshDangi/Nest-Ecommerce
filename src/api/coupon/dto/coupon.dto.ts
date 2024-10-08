import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsEnum(['percentage', 'fixed_amount'])
  type: string;

  @IsNumber()
  value: number;

  @IsDate()
  @Type(() => Date)
  expirationDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsNumber()
  maxUsageCount: number;

  @IsNotEmpty()
  @IsNumber()
  minPurchaseAmount: number;
}

export class UpdateCouponDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsEnum(['percentage', 'fixed_amount'])
  type?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expirationDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsNumber()
  maxUsageCount?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  minPurchaseAmount?: number;
}
