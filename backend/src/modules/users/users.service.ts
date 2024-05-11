import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { userWithoutPasswordDto } from 'src/dtos/user-without-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<Partial<User>[]> {
    const users: User[] = await this.userRepository.getUsers();

    const start = (page - 1) * limit;
    const end = start + +limit;

    const paginatedUsers = users.slice(start, end);

    return paginatedUsers;
  }

  async getUserById(id: string): Promise<User> {
    const user: User | null = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  //REFACTORIZAR URGENTE AGUSTIN (MANEJO DE ERRORES 😡)

  async getUserByEmail(email: string): Promise<userWithoutPasswordDto> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) throw new NotFoundException('User not found');

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async updateUserById(
    id: string,
    updateUser: Partial<UpdateUserDto>,
  ): Promise<string> {
    const user: User | null = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.updateUserById(id, updateUser);

    return user.id;
  }

  async deleteUserById(id: string): Promise<string> {
    const user: User | null = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.deleteUserById(user);

    return user.id;
  }

  async logicalDelete(id: string): Promise<string> {
    const user: User | null = await this.userRepository.getUserById(id);
    if (!user) throw new NotFoundException('User not found');
    user.isActive = false;

    await this.usersRepository.save(user);
    return user.id;
  }
}
