import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  Length,
  IsIn,
  IsOptional,
} from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword';
import { Genre } from 'src/helpers/genres.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @Matches(/^[A-Za-z ]+$/, { message: 'Name should only contain letters' })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*).',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @MatchPassword()
  confirmPassword: string;

  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only digits.',
  })
  phoneNumber: string; // falta revisar formato de numero

  @IsString()
  birthdate: string;

  @IsIn([Genre.MALE, Genre.FEMALE, Genre.OTHER])
  @IsString()
  gender: string;

  @IsOptional()
  @IsString()
  height: string;

  @IsOptional()
  @IsString()
  weight: string;

  @IsString()
  @Length(3, 80)
  address: string;

  @IsString()
  membershipName: string;
}
