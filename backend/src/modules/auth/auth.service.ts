import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { loginDto } from 'src/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto) {
    const foundUser: User | null = await this.usersRepository.getUserByEmail(
      user.email,
    );

    if (foundUser) throw new BadRequestException('User already exists');

    const saltRounds = 10;
    const hash: string = await bcrypt.hash(user.password, saltRounds);

    const signupDate = new Date();

    const day = String(signupDate.getDate()).padStart(2, '0');
    const month = String(signupDate.getMonth() + 1).padStart(2, '0');
    const year = signupDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    const { confirmPassword, ...restUser } = user;

    const signedupUser: Partial<User> = await this.usersRepository.createUser({
      ...restUser,
      password: hash,
      signup_date: formattedDate,
    });

    return signedupUser;
  }

  async login({ email, password }: loginDto) {
    const user: User | null = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new BadRequestException('Invalid email or password');

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    try {
      const token = this.jwtService.sign(payload);

      return {
        message: 'User logged in successfully',
        token,
        user,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create JWT token');
    }
  }
}
