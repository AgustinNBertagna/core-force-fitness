import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './middlewares/logger.middleware';
import { Validation } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 10000;
  app.enableCors();
  app.use(new Logger().use);
  app.useGlobalPipes(Validation);
  await app.listen(port as unknown as number);
}
bootstrap();
