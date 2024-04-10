import sequelize from '@database/sequelize';
import redis from '@database/redis';

export const db = { sequelize, redis };
