import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { loginDto } from 'src/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('users/signup')
  async signup(@Body() user: CreateUserDto) {
    const {
      name,
      email,
      password,
      phoneNumber,
      birthdate,
      gender,
      height,
      weight,
      address,
    } = user;

    return await this.authService.signup({
      name,
      email,
      password,
      phoneNumber,
      birthdate,
      gender,
      height,
      weight,
      address,
    });
  }

  @Post('users/login')
  async login(@Body() credentials: loginDto) {
    const { email, password } = credentials;

    return await this.authService.login({ email, password });
  }
}
