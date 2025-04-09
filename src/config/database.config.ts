import { registerAs } from '@nestjs/config';
import { tryParseInt } from 'src/common/utils/number-utils';

export default registerAs('database', () => ({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: tryParseInt(process.env.DB_PORT) ?? 5432,
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'nestjs_crud',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // No usar en producción
  // logging: process.env.NODE_ENV !== 'production',
  logging: false,
}));