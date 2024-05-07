import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const Validation = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors) => {
    const cleanErrors = errors.map((error) => {
      return { property: error.property, constraints: error.constraints };
    });
    return new BadRequestException({
      alert: 'Request Error',
      errors: cleanErrors,
    });
  },
});
