import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class CreateFirebaseDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @MaxLength(30, {
    message: 'La contraseña no puede exceder los 30 caracteres.',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula.',
  })
  @Matches(/(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra minúscula.',
  })
  @Matches(/(?=.*[0-9])/, {
    message: 'La contraseña debe contener al menos un número.',
  })
  password: string;
}
