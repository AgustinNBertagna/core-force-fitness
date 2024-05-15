import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmailsService } from '../emails/emails.service';
import { MembershipsService } from '../memberships/memberships.service';
import { userWithoutPasswordDto } from 'src/dtos/user-without-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailsService: EmailsService,
    private readonly membershipsService: MembershipsService,
  ) {}

  async signup({
    name,
    email,
    password,
    phoneNumber,
    birthdate,
    gender,
    height,
    weight,
    address,
    membershipName,
  }) {
    const user: userWithoutPasswordDto | null =
      await this.usersRepository.getUserByEmail(email);

    if (user) throw new BadRequestException('User already exists');

    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    const signupDate = new Date();

    const day = String(signupDate.getDate()).padStart(2, '0');
    const month = String(signupDate.getMonth() + 1).padStart(2, '0');
    const year = signupDate.getFullYear();

    const formattedDate = `${day}-${month}-${year}`;

    const newUser: User = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hash;
    newUser.signup_date = formattedDate;
    if (phoneNumber) newUser.phoneNumber = phoneNumber;
    if (birthdate) newUser.birthdate = birthdate;
    if (gender) newUser.gender = gender;
    if (height) newUser.height = height;
    if (weight) newUser.weight = weight;
    if (address) newUser.address = address;

    const signedupUser: Partial<User | null> =
      await this.usersRepository.createUser(newUser);

    const foundUser: userWithoutPasswordDto | null =
      await this.usersRepository.getUserByEmail(email);

    if (!foundUser) throw new NotFoundException('User not found');

    await this.membershipsService.assignMembership(
      foundUser?.id,
      membershipName,
    );

    await this.emailsService.sendWelcomeMail(name, email);

    return signedupUser;
  }

  async login({ email, password }) {
    const user: User | null = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new BadRequestException('Invalid email or password');

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    try {
      const token = this.jwtService.sign(payload);

      return {
        message: 'User logged in successfully',
        token,
        userId: user.id,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create JWT token');
    }
  }
}
