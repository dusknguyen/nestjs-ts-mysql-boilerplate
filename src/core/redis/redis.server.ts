import configuration from 'config';
import type { RedisOptions } from 'ioredis';
import Redis from 'ioredis';

// Define Redis connection options
const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  host: 'redis',
};

// Fetch the parsed configuration
const config = configuration();

// Initialize Redis client
const redisClient = new Redis(config.redis.port, config.redis.host, redisOptions);

export default redisClient;
