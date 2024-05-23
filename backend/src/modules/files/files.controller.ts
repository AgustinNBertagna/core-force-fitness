import {
  Controller,
  Param,
  Post,
  Put,
  Get,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileParser } from 'src/pipes/parseFile.pipe';
import { CreateRoutineDto } from 'src/dtos/create-routine.dto';
import { Routine } from 'src/entities/routines.entity';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') userId: string,
    @UploadedFile(FileParser)
    file: Express.Multer.File,
  ) {
    return await this.filesService.uploadImage(userId, file);
  }

  @Put('updateImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateUserImage(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.filesService.updateUserImage(userId, file);
  }

  //agregar dto capaz
  @Post('uploadPdf')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile(FileParser) file: Express.Multer.File,
    @Body()
    routineData: CreateRoutineDto,
  ) {
    return await this.filesService.uploadPdf(file, routineData);
  }

  @Get('routines/seeder')
  seedRoutines(): Promise<string> {
    return this.filesService.seedRoutines();
  }

  @Get('routines')
  getRoutines() {
    return this.filesService.getRoutines();
  }
}
