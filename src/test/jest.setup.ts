// eslint-disable-next-line import/no-extraneous-dependencies
import { afterAll, beforeAll } from '@jest/globals';
import { db } from '@src/configs/database';
import { syncDatabase } from '@src/configs/database/postgresql';

afterAll(async () => {
  await db.sequelize.close();
  await db.redis.quit();
});

beforeAll(async () => {
  await syncDatabase();
});
