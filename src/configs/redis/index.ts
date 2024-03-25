import Redis from 'ioredis';
import { config } from 'dotenv';
import logger from '../logger';

config();

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || '',
  retryStrategy(times) {
    if (times % 4 === 0) {
      logger.error('Redis reconnect exhausted after 3 retries.');
      return null;
    }
    return 200;
  },
});

redis.on('connect', () => {
  logger.log('Redis connected');
});

export default redis;
