import KeyvRedis from '@keyv/redis';
import configuration from 'config';
import type { RedisOptions } from 'ioredis';
import Redis from 'ioredis';

const config = configuration();
const { host, port } = config.redis;

// Optimized Redis options
const redisOptions: RedisOptions = {
  enableOfflineQueue: true,
  maxRetriesPerRequest: 3, // Prevent infinite retries
  enableReadyCheck: true, // Ensure Redis is ready before processing requests
  connectTimeout: 5000, // Timeout for initial connection
  lazyConnect: true, // Delay connection until a command is issued
  keepAlive: 10000, // Maintain persistent connection
  commandTimeout: 3000, // Set timeout for individual Redis commands
};

// Use shared connection instead of creating multiple instances
const sharedRedisClient = new Redis(port, host, redisOptions);

export const redisClients = {
  cache: new KeyvRedis(`redis://${host}:${port}`, {
    namespace: 'cache', // Namespace for cache entries in KeyvRedis
  }),
  session: sharedRedisClient.duplicate({ keyPrefix: 'session' }),
  queue: sharedRedisClient.duplicate({ keyPrefix: 'queue' }),
  logs: sharedRedisClient.duplicate({ keyPrefix: 'logs' }),
  socket: {
    pub: sharedRedisClient.duplicate({ keyPrefix: 'socket-pub' }),
    sub: sharedRedisClient.duplicate({ keyPrefix: 'socket-sub' }),
  },
};
