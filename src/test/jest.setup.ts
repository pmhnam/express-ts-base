/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-await-in-loop */
import { afterAll, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { db } from '@db';
import { syncDatabase } from '@db/sequelize';

async function seedDatabase() {
  const seedDirectory = path.join(__dirname, '../database/seeders');
  const seedFiles = fs.readdirSync(seedDirectory).filter((file) => file.endsWith('.js'));
  const queryInterface = db.sequelize.getQueryInterface();

  for (const seed of seedFiles) {
    const seedFile = path.join(seedDirectory, seed);
    const { up } = require(seedFile);
    try {
      await up(queryInterface, Sequelize);
    } catch (error) {
      // empty
    }
  }
}

afterAll(async () => {
  await db.sequelize.close();
  await db.redis.quit();
});

beforeAll(async () => {
  await syncDatabase();
  await seedDatabase();
});
