import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddlwareGlobal } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerMiddlwareGlobal);
  await app.listen(3000);
}
bootstrap();
