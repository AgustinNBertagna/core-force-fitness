import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.development' });

const config = {
  // dropSchema: true,
  type: 'postgres',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: ['error'],
  synchronize: true,
  ssl: {
    rejectUnauthorized: false, // Solo si estás trabajando localmente sin SSL
  },
  extra: {
    ssl: {
      require: true,
    },
  },
};
export default registerAs('typeorm', () => config);

export const connectionSource = new DataSource(config as DataSourceOptions);
