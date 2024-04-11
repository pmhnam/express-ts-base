import { Options, Sequelize } from 'sequelize';
import { config } from 'dotenv';
import { InternalServerHTTP } from '@configs/httpException';
import logger from '@configs/logger';
import { postgresConfig } from '@db/sequelize/config.postgresql';

config();

const DB_CONNECT_TIMEOUT = 10 * 1000;
const DB_RECONNECT_TIMEOUT = 1 * 1000;
let connectionTimeout: NodeJS.Timeout | null = null;
let reconnectTimeout: NodeJS.Timeout | null = null;

const sequelize = new Sequelize(postgresConfig as Options);

export const syncDatabase = async (opts?: { force?: boolean }) => {
  try {
    const { force = false } = opts || {};
    await sequelize.authenticate();
    await sequelize.sync({ ...(force ? { force: true } : { alter: true }) });
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (connectionTimeout) clearTimeout(connectionTimeout);
    logger.log('DB connected');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
