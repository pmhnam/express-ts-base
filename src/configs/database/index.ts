import sequelize from './postgresql';
import redis from './redis';

export const db = {
  sequelize,
  redis,
};
