import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateFirebaseDto {
  @IsNotEmpty()
  @IsString()
  firebaseId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  imagen: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}
