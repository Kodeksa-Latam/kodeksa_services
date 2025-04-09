import { registerAs } from '@nestjs/config';
import { tryParseInt } from 'src/common/utils/number-utils';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: tryParseInt(process.env.PORT) ?? 3000,
  apiPrefix: process.env.API_PREFIX ?? 'api',
  apiTimeout: tryParseInt(process.env.API_TIMEOUT) ?? 5000,
}));