import morgan from 'morgan';
import logger from '../logger';

export const accessLogsMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  }
);
