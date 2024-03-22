// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const configDB = {
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'db_core',
  host: process.env.DB_HOSTNAME || '127.0.0.1',
  port: Number(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    // ssl: {
    //   require: true,
    //   rejectUnauthorized: false,
    // },
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
  seederStorage: 'sequelize',
  seederStorageTableName: 'seeder',
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'migration',
  logging: process.env.SHOW_QUERY_LOG === 'true',
};
