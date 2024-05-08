import {
  IsEmail,
  IsString,
  Matches,
  Length,
  IsIn,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 80)
  @Matches(/^[A-Za-z]+$/, { message: 'Name should only contain letters' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only digits.',
  })
  phoneNumber: string; // falta revisar formato de numero

  @IsOptional()
  @IsString()
  birthdate: string;

  @IsOptional()
  @IsIn(['male', 'female', 'other'])
  @IsString() // ver si colocar los generos en  un helper
  gender: string;

  @IsOptional()
  @IsString()
  height: string;

  @IsOptional()
  @IsString()
  weight: string;

  @IsOptional()
  @IsString()
  @Length(3, 80)
  address: string;
}
