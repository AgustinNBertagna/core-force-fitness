import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFirebaseDto } from 'src/dtos/create-firebase.dto';
import { userWithoutPasswordDto } from 'src/dtos/user-without-password.dto';
import { User } from 'src/entities/user.entity';
import { EmailsService } from 'src/modules/emails/emails.service';
import { MembershipsService } from 'src/modules/memberships/memberships.service';
import { UserRepository } from 'src/modules/users/users.repository';
import { Repository } from 'typeorm';

@Injectable()
export class FirebaseService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly userRepository: UserRepository,
    private readonly membershipsService: MembershipsService,
    private readonly emailsService: EmailsService,
  ) {}

  async createUserWithGoogle(createUserDto: CreateFirebaseDto): Promise<User> {
    const { firebaseId, name, email, imagen } = createUserDto;

    console.log(createUserDto);

    try {
      const existingUser = await this.usersRepository.findOne({
        where: { firebaseId },
      });
      console.log(existingUser);
      if (existingUser) {
        return existingUser;
      } else {
        const newUser: User = new User();
        newUser.firebaseId = createUserDto.firebaseId;
        newUser.name = createUserDto.name;
        newUser.email = createUserDto.email;
        newUser.profile_image = createUserDto.imagen;
        newUser.birthdate = new Date().toISOString();
        newUser.signup_date = new Date().toISOString();
        newUser.gender = 'Insertar genero';
        newUser.password = email;

        // new Date().toISOString(); // helper para formatear
        const membershipName = 'Free';
        const savedUser = await this.usersRepository.save(newUser);
        const foundUser: userWithoutPasswordDto | null =
          await this.userRepository.getUserByEmail(email);

        if (!foundUser) throw new NotFoundException('User not found');

        await this.membershipsService.assignMembership(
          foundUser?.id,
          membershipName,
        );

        await this.emailsService.sendWelcomeMail(name, email);

        return savedUser;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error interno del servidor');
    }
  }
}