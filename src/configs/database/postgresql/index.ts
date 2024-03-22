import { Sequelize, Dialect } from 'sequelize';
import { config } from 'dotenv';
import { configDB } from './config.sequelize';

config();

const sequelize = new Sequelize(configDB.database as string, configDB.username as string, configDB.password, {
  ...configDB,
  dialect: configDB.dialect as Dialect,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('> Connection to the database has been established successfully.');
  } catch (error) {
    console.error('> Unable to connect to the database:', error);
  }
};

export const db = {
  sequelize,
};
