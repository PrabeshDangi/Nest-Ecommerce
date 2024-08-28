import { IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

export class createRatingDTO {
  @IsOptional()
  comment: string;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  rating: number;
}
