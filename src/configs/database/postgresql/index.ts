import { Options, Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { InternalServerHTTP } from '@src/configs/httpException';
import logger from '@src/configs/logger';
import { NODE_ENV } from '@src/utils/constants/enum';
import { postgresConfig } from './config.postgresql';
import { sqliteConfig } from './config.sqlite';

config();

const isTestMode = process.env.NODE_ENV === NODE_ENV.TEST;
const DB_CONNECT_TIMEOUT = 10 * 1000;
const DB_RECONNECT_TIMEOUT = 1 * 1000;
let connectionTimeout: NodeJS.Timeout | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

const postgresql = new Sequelize(postgresConfig as Options);
const sqlite = new Sequelize(sqliteConfig);

const sequelize = isTestMode ? sqlite : postgresql;

export const syncDatabase = async (opts?: { force?: boolean }) => {
  try {
    const { force = false } = opts || {};
    await sequelize.authenticate();
    await sequelize.sync({ ...(force ? { force: true } : { alter: true }) });
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (connectionTimeout) clearTimeout(connectionTimeout);
    logger.log('DB connected');
  } catch (error: any) {
    logger.error('DB connection failed, reconnecting...');
    // try to reconnect
    reconnectTimeout = setTimeout(syncDatabase, DB_RECONNECT_TIMEOUT);
    if (!connectionTimeout) {
      connectionTimeout = setTimeout(() => {
        logger.error('DB connection failed', { metadata: error });
        throw new InternalServerHTTP('DB connection failed');
      }, DB_CONNECT_TIMEOUT);
    }
  }
};

export default sequelize;
