import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../users/users.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup({
    name,
    email,
    password,
    phoneNumber,
    birthdate,
    gender,
    height,
    weight,
    address,
  }) {
    const user: User | null = await this.usersRepository.getUserByEmail(email);

    if (user) throw new BadRequestException('User already exists');

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const newUser: User = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hash;
    if (phoneNumber) newUser.phoneNumber = phoneNumber;
    if (birthdate) newUser.birthdate = birthdate;
    if (gender) newUser.gender = gender;
    if (height) newUser.height = height;
    if (weight) newUser.weight = weight;
    if (address) newUser.address = address;

    const signedupUser: Partial<User> =
      await this.usersRepository.createUser(newUser);

    return signedupUser;
  }

  async login({ email, password }) {
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
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create JWT token');
    }
  }
}
