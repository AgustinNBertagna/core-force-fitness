import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({
      select: [
        'address',
        'birthdate',
        'email',
        'gender',
        'height',
        'id',
        'name',
        'phoneNumber',
        'profile_image',
        'role',
        'signup_date',
        'students',
        'trainer',
        'user_membership',
        'weight',
      ],
    });

    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id },
      relations: ['user_membership'],
      select: [
        'address',
        'birthdate',
        'email',
        'gender',
        'height',
        'id',
        'name',
        'phoneNumber',
        'profile_image',
        'role',
        'signup_date',
        'students',
        'trainer',
        'user_membership',
        'weight',
      ],
    });

    return user;
  }

  async updateUserById(
    id: string,
    updateUser: Partial<UpdateUserDto>,
  ): Promise<void> {
    await this.usersRepository.update(id, updateUser);
  }

  async deleteUserById(user: User): Promise<void> {
    await this.usersRepository.delete(user);
  }

  async createUser(user: Partial<User>): Promise<Partial<User>> {
    const newUser = this.usersRepository.create(user);
    await this.usersRepository.save(newUser);

    const { password, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user;
  }
}
