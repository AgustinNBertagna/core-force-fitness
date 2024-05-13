import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { Membership } from 'src/entities/membership.entity';
import { User } from 'src/entities/user.entity';
import { UserMemberships } from 'src/entities/userMembership.entity';
import { Role } from 'src/helpers/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(
    userType: string,
    membership: string,
    gender: string,
  ): Promise<User[]> {
    const where: Partial<User> = {};

    where.isActive = true;

    if (userType === Role.USER) where.role = Role.USER;
    if (userType === Role.TRAINER) where.role = Role.TRAINER;
    if (userType === Role.ADMIN) where.role = Role.ADMIN;

    if (gender !== 'all') where.gender = gender;

    if (membership !== 'all') {
      const userMembershipsObj: UserMemberships = new UserMemberships();
      const membershipObj: Membership = new Membership();
      membershipObj.name = membership;
      userMembershipsObj.membership = membershipObj;

      where.user_membership = userMembershipsObj;
    }

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
        'isActive',
      ],
      where,
    });

    return users;
  }

  async getUserById(id: string): Promise<User | null> {
    const user: User | null = await this.usersRepository.findOne({
      where: { id, isActive: true },
      relations: { user_membership: { membership: true } },
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

  //REFACTORIZAR URGENTE AGUSTIN (MANEJO DE ERRORES 😡)

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: { email, isActive: true },
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

  async createUser(user: Partial<User>): Promise<Partial<User> | null> {
    await this.usersRepository.save(user);
    const userWithoutPassword = await this.usersRepository.findOne({
      where: { id: user.id },
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

    return userWithoutPassword;
  }
}
