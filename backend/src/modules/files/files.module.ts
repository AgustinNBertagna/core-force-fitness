import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { cloudinaryConfig } from 'src/config/cloudinary';
import { FilesRepository } from './files.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [FilesController],
  providers: [FilesService, cloudinaryConfig, FilesRepository],
})
export class FilesModule {}
