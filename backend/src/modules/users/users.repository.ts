import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number): Promise<Partial<User>[]> {
    let users = await this.usersRepository.find();

    const start = (page - 1) * limit;
    const end = start + +limit;

    users = users.slice(start, end);

    return users.map(({ password, ...user }) => user);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersRepository.findOne({
      where: { id },
    });

    const { password, ...userWithoutPassword } = user;
    console.log(password); //borrar

    return userWithoutPassword;
  }

  async createUser(user: Partial<User>): Promise<Partial<User>> {
    const newUser = await this.usersRepository.save(user);

    const { password, ...userWithoutPassword } = newUser;
    console.log(password); //borrar

    return userWithoutPassword;
  }

  async putUserById(
    id: string,
    updateUser: Partial<UpdateUserDto>,
  ): Promise<string> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersRepository.update(id, updateUser);
    return id;
  }

  async deleteUser(id: string): Promise<string> {
    const userFound = await this.usersRepository.findOne({ where: { id } });
    await this.usersRepository.delete(userFound);
    return userFound.id;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user;
  }
}
