import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: parseInt(process.env.DB_PORT || '4000'),
  username: process.env.DB_USERNAME || '4KECEKDUPPkLHum.root',
  password: process.env.DB_PASSWORD || 'hbTEmPoKO4okuah5',
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