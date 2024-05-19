import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { userWithoutPasswordDto } from 'src/dtos/user-without-password.dto';
import { Membership } from 'src/entities/membership.entity';
import { UserMemberships } from 'src/entities/userMembership.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserMemberships)
    private membershipRepository: Repository<UserMemberships>,
  ) {}

  async getUsers(
    page: number,
    limit: number,
    userType: string,
    membership: string,
    gender: string,
  ): Promise<Partial<User>[]> {
    const users: User[] = await this.userRepository.getUsers(
      userType,
      membership,
      gender,
    );

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

    if (user.user_membership) {
      await this.membershipRepository.delete(user.user_membership);
    }
    //students
    await this.usersRepository.save(user);
    return user.id;
  }
}
