import { config } from 'dotenv';

config();

export const postgresConfig = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'db_core',
  host: process.env.DB_HOSTNAME || '127.0.0.1',
  port: Number(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ...(process.env.NODE_ENV === 'production' && {
      ssl: { require: true },
      connection: {
        options: `project=${process.env.DB_ENDPOINT_ID}`,
      },
    }),
    useUTC: false,
    timezone: '+08:00',
  },
  pool: {
    min: 0,
    max: 350,
    idle: 10000,
    acquire: 220000,
  },
  timezone: '+08:00',
  logging: process.env.SHOW_QUERY_LOG === 'true',
};
