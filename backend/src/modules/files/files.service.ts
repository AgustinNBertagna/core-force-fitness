import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Routine } from 'src/entities/routines.entity';

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

  async uploadPdf(routineId: string, file: Express.Multer.File) {
    const routine = await this.routineRepository.findOne({
      where: { id: routineId },
    });

    if (!routine) {
      throw new NotFoundException('Routine not found');
    }

    const uploadPdf = await this.filesRepository.uploadPdf(file);

    if (routine.id) {
      await this.routineRepository.update(routine.id, {
        pdf_url: uploadPdf.secure_url,
      });
    } else {
      throw new Error('Routine ID not found');
    }

    return {
      message: 'PDF uploaded successfully',
      pdfUrl: uploadPdf.secure_url,
    };
  }
}
