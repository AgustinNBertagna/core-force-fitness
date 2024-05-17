import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
    private readonly membershipsService: MembershipsService,
    private readonly emailsService: EmailsService,
  ) {}

  async createUserWithGoogle(createUserDto: CreateFirebaseDto) {
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
        await this.usersRepository.save(newUser);
        const foundUser: userWithoutPasswordDto | null =
          await this.userRepository.getUserByEmail(email);

        if (!foundUser) throw new NotFoundException('User not found');

        await this.membershipsService.assignMembership(
          foundUser?.id,
          membershipName,
        );

        const payload = {
          sub: newUser.id,
          userId: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        };
        const token = this.jwtService.sign(payload);
        await this.emailsService.sendWelcomeMail(name, email);

        return {
          message: 'User logged in successfully',
          token,
          userId: newUser.id,
        };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error interno del servidor');
    }
  }
}
