// eslint-disable-next-line import/no-extraneous-dependencies
import { afterAll } from '@jest/globals';
import { db } from '@src/configs/database';

afterAll(async () => {
  await db.sequelize.close();
  await db.redis.quit();
});
