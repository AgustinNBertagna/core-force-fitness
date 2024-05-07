import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Matches,
  Length,
  IsIn,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  @Matches(/^[A-Za-z]+$/, { message: 'Name should only contain letters' })
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
  confirmPassword: string; // falta agregar matchpassword decorator

  @IsString()
  @Matches(/^[0-9]+$/, {
    message: 'Phone number must contain only digits.',
  })
  phoneNumber: string; // falta revisar formato de numero

  @IsString()
  birthdate: string;

  @IsIn(['male', 'female', 'other'])
  @IsString() // ver si colocar los generos en  un helper
  gender: string;

  @IsString()
  height: string;

  @IsString()
  weight: string;

  @IsString()
  @Length(3, 80)
  address: string;
}
