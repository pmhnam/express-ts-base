import { getCache, removeCache, setCache } from '@db/redis/cache';
import { NextFunction, Request, Response } from 'express';

export abstract class CoreController {
  public setCache = async (key: string, data: object | object[], opts?: { metadata?: object; ttl?: number }) => {
    const { metadata, ttl } = opts || {};
    return await setCache(key, { data, metadata }, ttl);
  };

  public getCache = async (key: string) => {
    return await getCache(key);
  };

  public removeCache = async (key: string) => {
    return await removeCache(key);
  };

  public cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { originalUrl } = req;
    const cache = await getCache(originalUrl);
    if (!cache) {
      return next();
    }
    const { metadata, data } = cache;
    return res.onSuccess(data, { code: 206, metadata });
  };
}
