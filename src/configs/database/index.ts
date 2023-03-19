import mongoose from 'mongoose';
import logger from '../logger';

export const ConnectMongoDB = (mongo_uri: string = process.env.MONGO_URI || '') => {
  mongoose
    .connect(mongo_uri, {})
    .then(() => logger.log(`Connect mongoDB successfully with ${mongo_uri}`))
    .catch((err: Error) => logger.error(`Error while connecting to mongoDB::${err.message}`));
};
