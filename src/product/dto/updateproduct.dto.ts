import { Size } from "@prisma/client";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsNotEmpty, IsNumber, IsArray, IsBoolean, IsEnum } from "class-validator";
import { CategoryDto } from "./createproduct.dto";

export class UpdateProductDto {
  
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    title?: string;
  
    @IsOptional()
    @IsNumber()
    price?: number;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    image?: string[];
  
    @IsOptional()
    @IsBoolean()
    discounttag?: boolean;
  
    @IsOptional()
    @IsNumber()
    rating?: number;
  
    @IsOptional()
    @IsNumber()
    discountprice?: number;
  
    @IsOptional()
    @IsEnum(Size)
    sizes?: Size; 
  
    @IsOptional()
    @IsString()
    returnpolicy?: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsOptional()
    @IsString()
    brand?: string;
  
    @IsOptional()
    @IsBoolean()
    availability?: boolean;
  
    @IsOptional()
    @Type(() => CategoryDto)
    @IsArray()
    categories?: CategoryDto[];
  }