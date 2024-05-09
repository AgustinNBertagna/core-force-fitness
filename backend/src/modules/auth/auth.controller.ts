import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { loginDto } from 'src/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() user: CreateUserDto) {
    return await this.authService.signup(user);
  }

  @Post('login')
  async login(@Body() credentials: loginDto) {
    const { email, password } = credentials;

    return await this.authService.login({ email, password });
  }
}
