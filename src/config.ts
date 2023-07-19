import { ConfigModule } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

ConfigModule.forRoot();

type config = {
  Database: DataSourceOptions;
  Secret: string;
};

export const Config: config = {
  Database: {
    type: 'postgres',
    host: process.env.HOST,
    port: +process.env.PORT,
    username: process.env.USERNAME,
    password: process.env.USERNAME,
    database: process.env.DB,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: true,
  },
  Secret: process.env.SECRET,
};
