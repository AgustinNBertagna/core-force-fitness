import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './middlewares/logger.middleware';
import { Validation } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(new Logger().use);
  app.useGlobalPipes(Validation);
  await app.listen(3000);
}
bootstrap();
