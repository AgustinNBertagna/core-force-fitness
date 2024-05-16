import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFirebaseDto } from 'src/dtos/create-firebase.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FirebaseService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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

        const savedUser = await this.usersRepository.save(newUser);
        console.log(savedUser);
        return savedUser;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error interno del servidor');
    }
  }
}
