import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class Rate {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rate: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
