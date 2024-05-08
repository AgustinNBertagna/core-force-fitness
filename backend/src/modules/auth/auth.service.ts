import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepository: UserRepository) {}

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
    const user: User = await this.usersRepository.getUserByEmail(email);

    if (user) throw new BadRequestException('User already exists');

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password; // implementar bcrypt
    if (phoneNumber) newUser.phonenumber = phoneNumber;
    if (birthdate) newUser.birthdate = birthdate;
    if (gender) newUser.gender = gender;
    if (height) newUser.height = height;
    if (weight) newUser.weight = weight;
    if (address) newUser.address = address;

    return await this.usersRepository.createUser(newUser);
  }

  async login({ email, password }) {
    const user: User = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new BadRequestException('Invalid email or password');

    if (password !== user.password)
      throw new BadRequestException('Invalid email or password'); // Implementar bcrypt

    // Implementar JWT

    return 'User logged in successfully';
  }
}
