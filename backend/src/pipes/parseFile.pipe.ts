import {
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';

const SizeValidator = new MaxFileSizeValidator({
  maxSize: 200000,
  message: 'El archivo no debe exceder los 200kb',
});

const TypeValidator = new FileTypeValidator({
  fileType: /(jpg|jpeg|png|webp)$/,
});

export const FileParser = new ParseFilePipe({
  validators: [SizeValidator, TypeValidator],
});
