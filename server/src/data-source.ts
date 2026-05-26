import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'somaricha_user',
  password: process.env.DB_PASSWORD || 'somaricha_password',
  database: process.env.DB_DATABASE || 'somaricha',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    __dirname + '/**/entities/*.entity{.ts,.js}'
  ],
  migrations: [
    __dirname + '/migrations/**/*{.ts,.js}'
  ],
  synchronize: false, // Set to false to use migrations instead
});