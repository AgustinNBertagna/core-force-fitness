import { BadRequestException, Injectable } from '@nestjs/common';
// import { Trainer } from 'src/entities/trainer.entity';
import { User } from 'src/entities/user.entity';
import { UserRepository } from '../users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    // private readonly trainersRepository: TrainersRepository,
  ) {}

  async signupUser({
    name,
    email,
    password,
    phoneNumber,
    birthdate,
    gender,
    address,
  }) {
    const user: User = await this.usersRepository.getUserByEmail(email);

    if (user) throw new BadRequestException('User already exists');

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = password; // implementar bcrypt
    if (phoneNumber) newUser.phonenumber = phoneNumber; // modificar nombre de propiedad phone a phoneNumber en entidad User
    if (birthdate) newUser.birthdate = birthdate;
    if (gender) newUser.gender = gender;
    if (address) newUser.address = address;

    // Falta implementar height y weight en la entidad de User
    return await this.usersRepository.createUser(newUser);
  }

  async loginUser({ email, password }) {
    const user: User = await this.usersRepository.getUserByEmail(email);

    if (!user) throw new BadRequestException('Invalid email or password');

    if (password !== user.password)
      throw new BadRequestException('Invalid email or password'); // Implementar bcrypt

    // Implementar JWT

    return 'User logged in successfully';
  }

  // async signupTrainer({ name, email, password, phoneNumber }) {
  //   const trainer: Trainer =
  //     await this.trainersRepository.getTrainerByEmail(email);

  //   if (trainer) throw new BadRequestException('Trainer already exists');

  //   const newTrainer = new Trainer();
  //   newTrainer.name = name;
  //   newTrainer.email = email;
  //   newTrainer.password = password; // implementar bcrypt
  //   newTrainer.phonenumber = phoneNumber; // colocar dicha propiedad con nullable false en entidad

  //   return await this.trainersRepository.createTrainer(newTrainer);
  // }

  // async loginTrainer({ email, password }) {
  //   const trainer: Trainer =
  //     await this.trainersRepository.getTrainerByEmail(email);

  //   if (!trainer) throw new BadRequestException('Invalid email or password');

  //   if (password !== trainer.password)
  //     throw new BadRequestException('Invalid email or password'); // implementar bcrypt

  //   return 'Trainer logged in successfully';
  // }
}
