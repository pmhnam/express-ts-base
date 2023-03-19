import { config } from 'dotenv';
import { Options } from 'sequelize';

config();

export const sqliteConfig: Options = { dialect: 'sqlite', storage: './database.sqlite3', logging: false };
