/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-dynamic-require */
// eslint-disable-next-line import/no-extraneous-dependencies
import { afterAll, beforeAll } from '@jest/globals';
import { db } from '@src/configs/database';
import { syncDatabase } from '@src/configs/database/postgresql';
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';

async function runSeeders() {
  const seedDir = path.join(__dirname, '../configs/database/seeders');
  const seeds = fs.readdirSync(seedDir).filter((file) => file.endsWith('.js'));
  const queryInterface = db.sequelize.getQueryInterface();

  for (const seed of seeds) {
    const seedFile = path.join(seedDir, seed);
    const { up } = require(seedFile);
    try {
      await up(queryInterface, Sequelize);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }
}

afterAll(async () => {
  await db.sequelize.close();
  await db.redis.quit();
});

beforeAll(async () => {
  await syncDatabase({ force: true });
  await runSeeders();
});
