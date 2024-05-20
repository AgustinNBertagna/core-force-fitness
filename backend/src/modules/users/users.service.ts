import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { userWithoutPasswordDto } from 'src/dtos/user-without-password.dto';
import { Membership } from 'src/entities/membership.entity';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { Rate } from 'src/entities/rate.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserMemberships)
    private membershipRepository: Repository<UserMemberships>,
    @InjectRepository(Rate)
    private rateRepository: Repository<Rate>,
  ) {}

  // page: number,
  // limit: number,
  async getUsers(
    userType: string,
    membership: string,
    gender: string,
  ): Promise<Partial<User>[]> {
    const users: User[] = await this.userRepository.getUsers(
      userType,
      membership,
      gender,
    );

    // const start = (page - 1) * limit;
    // const end = start + +limit;

    // const paginatedUsers = users.slice(start, end);

    return users;
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

    //BORRAR DESPUES DEL DESARROLLO
    const rateRelation = await this.rateRepository.findOneBy({ id: user.id });
    console.log(rateRelation);

    try {
      if (user.user_membership) {
        await this.membershipRepository.delete(user.user_membership);
      }
      if (rateRelation) {
        await this.rateRepository.remove(rateRelation);
      }
      if (user) {
        await this.membershipRepository.delete(user.user_membership);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Cannot delete relations from entity',
      );
    }
    //BORRAR DESPUES DEL DESARROLLO

    //students
    await this.usersRepository.save(user);
    return user.id;
  }
}
