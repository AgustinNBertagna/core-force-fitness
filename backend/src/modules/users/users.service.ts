import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUsers(page: number, limit: number): Promise<Partial<User>[]> {
    return await this.userRepository.getUsers(page, limit);
  }

  getUserById(id: string): Promise<Omit<User, 'password'>> {
    return this.userRepository.getUserById(id);
  }

  putUserById(id: string, updateUser: Partial<UpdateUserDto>): Promise<string> {
    return this.userRepository.putUserById(id, updateUser);
  }

  deleteUser(id: string): Promise<string> {
    return this.userRepository.deleteUser(id);
  }
}
