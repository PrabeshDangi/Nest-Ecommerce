import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class updateRatingDTO {
  @IsOptional()
  @IsInt()
  @Max(5)
  @Min(1)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
