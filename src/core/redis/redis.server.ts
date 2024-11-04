import configuration from 'config';
import type { RedisOptions } from 'ioredis';
import Redis from 'ioredis';

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  host: 'redis',
};
const config = configuration(); // Fetch the parsed configuration
const redisClient = new Redis(config.redis.port, config.redis.host, redisOptions);

export default redisClient;
