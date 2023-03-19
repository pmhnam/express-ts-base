import sequelize from './sequelize';
import redis from './redis';

export const db = { sequelize, redis };
