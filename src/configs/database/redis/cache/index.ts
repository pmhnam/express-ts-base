import logger from '@src/configs/logger';
import redis from '..';

// using redisJSON to store cache
export async function setCache(key: string, data: unknown, ttl = 1 * 60) {
  try {
    await redis.call('JSON.SET', key, '.', JSON.stringify(data));
    await redis.expire(key, ttl);
    return true;
  } catch (error: any) {
    logger.error(error.message, { metadata: error });
    throw error;
  }
}

export async function getCache(key: string) {
  const value = (await redis.call('JSON.GET', key, '.')) as string | null;
  if (!value) return null;
  return JSON.parse(value);
}

export async function removeCache(key: string) {
  return await redis.del(key);
}
