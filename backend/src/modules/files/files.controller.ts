import {
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileParser } from 'src/pipes/parseFile.pipe';

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

  @Post('uploadPdf/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @Param('id') routineId: string,
    @UploadedFile(FileParser) file: Express.Multer.File,
  ) {
    return await this.filesService.uploadPdf(routineId, file);
  }
}
