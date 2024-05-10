import { Injectable, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    private readonly filesRepository: FilesRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async uploadImage(userId: string, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const uploadImage = await this.filesRepository.uploadImage(userId, file);

    if (user.id) {
      await this.userRepository.update(user.id, {
        profile_image: uploadImage.secure_url,
      });
    } else {
      throw new Error('User ID not found');
    }

    return 'image uploaded successfully';
  }

  async updateProfileImage(userId: string, imageUrl: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(user.id, { profile_image: imageUrl });
    return 'Image updated successfully';
  }
}
