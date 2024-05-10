import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
