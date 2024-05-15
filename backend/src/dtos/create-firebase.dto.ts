import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateFirebaseDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(20, { message: 'El nombre no puede exceder los 20 caracteres.' })
  name: string;

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
