import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from './middlewares/logger.middleware';
import { Validation } from './pipes/validation.pipe';

// import cors from 'cors';

const cors = require('cors');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.use(new Logger().use);
  app.useGlobalPipes(Validation);
  await app.listen(3000);
}
bootstrap();
