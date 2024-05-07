import {
  IsString,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  IsStrongPassword,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateTrainerDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-z]+$/, { message: 'El nombre solo puede contener letras' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'El email no es valido' })
  email: string;

  @IsOptional()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsStrongPassword(
    {
      minNumbers: 1,
      minSymbols: 1,
      minLowercase: 1,
      minUppercase: 1,
    },
    {
      message:
        'La contraseña debe contener al menos una letra minuscula, una letra mayuscula, un numero y un caracter especial',
    },
  )
  password: string;

  @IsOptional()
  @IsPhoneNumber('AR', { message: 'El número de teléfono no es válido' })
  phone_number: string;
}
