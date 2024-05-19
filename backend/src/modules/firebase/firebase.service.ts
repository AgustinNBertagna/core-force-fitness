import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    private readonly membershipsService: MembershipsService,
    private readonly emailsService: EmailsService,
    private readonly jwtService: JwtService,
  ) {}

  async createUserWithGoogle(createUserDto: CreateFirebaseDto) {
    //problema con la promise por el message
    const { firebaseId, name, email, imagen } = createUserDto;

    try {
      const existingUser = await this.usersRepository.findOne({
        where: { firebaseId },
      });

      if (existingUser) {
        const payload = {
          sub: existingUser.id,
          userId: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        };

        try {
          const token = this.jwtService.sign(payload);

          return {
            message: 'User logged in successfully',
            token,
            userId: existingUser.id,
          };
        } catch (error) {
          throw new InternalServerErrorException('Failed to create JWT token');
        }
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

        const payload = {
          sub: foundUser.id,
          userId: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
        };

        try {
          const token = this.jwtService.sign(payload);

          return {
            message: 'User logged in successfully',
            token,
            userId: foundUser.id,
          };
        } catch (error) {
          throw new InternalServerErrorException('Failed to create JWT token');
        }
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}
