import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { loginDto } from 'src/dtos/login.dto';
import { CreateTrainerDto } from 'src/dtos/create-trainer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users/signup')
  async signupUser(@Body() user: CreateUserDto) {
    const { name, email, password, phoneNumber, birthdate, gender, address } =
      user; // añadir height y weight

    return await this.authService.signupUser({
      name,
      email,
      password,
      phoneNumber,
      birthdate,
      gender,
      address,
    });
  }

  @Post('users/login')
  async loginUser(@Body() credentials: loginDto) {
    const { email, password } = credentials;

    return await this.authService.loginUser({ email, password });
  }

  @Post('trainers/signup')
  async signupTrainer(@Body() trainer: CreateTrainerDto) {
    const { name, email, password, phoneNumber } = trainer;

    return await this.authService.signupTrainer({
      name,
      email,
      password,
      phoneNumber,
    });
  }

  @Post('trainers/login')
  async loginTrainer(@Body() credentials: loginDto) {
    const { email, password } = credentials;

    return await this.authService.loginTrainer({ email, password });
  }
}
