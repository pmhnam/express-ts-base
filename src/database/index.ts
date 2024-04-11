import sequelize from '@db/sequelize';
import redis from '@db/redis';

export const db = { sequelize, redis };
