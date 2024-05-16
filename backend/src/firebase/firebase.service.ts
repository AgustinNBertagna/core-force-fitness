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

    try {
      const existingUser = await this.usersRepository.findOne({
        where: { firebaseId },
      });

      if (existingUser) {
        return existingUser;
      } else {
        const newUser: User = new User();
        newUser.name = createUserDto.name;
        newUser.email = createUserDto.email;
        newUser.profile_image = createUserDto.imagen;
        newUser.birthdate = 'Insertar fechas';
        newUser.signup_date = new Date().toISOString(); // helper para formatear
        newUser.gender = 'Insertar genero';

        // const newUser = await this.usersRepository.create({
        //   firebaseId,
        //   name,
        //   email,
        //   imagen,
        //   height: '0',
        // });
        const savedUser = await this.usersRepository.save(newUser);
        return savedUser;
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error interno del servidor');
    }
  }
}
