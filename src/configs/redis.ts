import { getConfig } from 'src/configs';

export const redisConfig = {
  host: getConfig().get<string>('redis.host'),
  port: getConfig().get<number>('redis.port'),
};
