import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Routine } from 'src/entities/routines.entity';
import { CreateRoutineDto } from 'src/dtos/create-routine.dto';
import { Routines } from 'src/helpers/routines';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Routine)
    private readonly routineRepository: Repository<Routine>,
  ) {}

  async uploadImage(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadImage = await this.filesRepository.uploadImage(file);

    if (user.id) {
      await this.userRepository.update(user.id, {
        profile_image: uploadImage.secure_url,
      });
    } else {
      throw new Error('User ID not found');
    }

    return {
      message: 'Image uploaded successfully',
      imageUrl: uploadImage.secure_url,
    };
  }

  async updateUserImage(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException('User not found');

    const uploadImage = await this.filesRepository.uploadImage(file);

    await this.userRepository.update(userId, {
      profile_image: uploadImage.secure_url,
    });

    return 'User image successfully updated';
  }

  async uploadPdf(file: Express.Multer.File, routineData: CreateRoutineDto) {
    const uploadPdf = await this.filesRepository.uploadPdf(file);

    const newRoutine = this.routineRepository.create({
      pdf_url: uploadPdf.secure_url,
      type: routineData.typeRoutine,
      name: routineData.routineName,
    });

    console.log(newRoutine);
    await this.routineRepository.save(newRoutine);

    return {
      message: 'PDF uploaded and new routine created successfully',
      pdfUrl: uploadPdf.secure_url,
    };
  }
  async seedRoutines() {
    const routines = Routines.map((routineData) => {
      return this.routineRepository.create(routineData);
    });

    try {
      await this.routineRepository.save(routines);
      return 'Routines preloaded';
    } catch (err) {
      throw new Error('Failed to seed routines');
    }
  }

  async getRoutines(): Promise<Routine[]> {
    try {
      const routines = await this.routineRepository.find();
      return routines;
    } catch (err) {
      throw new NotFoundException('Memberships not found');
    }
  }
}
