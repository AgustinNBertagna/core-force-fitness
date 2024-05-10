import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploadImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 2000000,
            message: 'The image must be less than 2MB',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp|gif)$/i,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.filesService.uploadImage(userId, file);
  }

  @Post('updateProfileImage/:id')
  async updateProfileImage(
    @Param('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = await this.filesService.uploadImage(userId, file);
    const result = await this.filesService.updateProfileImage(userId, imageUrl);
    return { message: result };
  }
}
