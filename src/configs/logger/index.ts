import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

export interface IOptionsLoggerDto {
  metadata?: Record<string, unknown>;
  requestId?: string;
  context?: string;
}

class AppLogger {
  public logger: Logger;
  constructor() {
    const formatPrint = format.printf(({ level, message, context = '', timestamp, metadata, requestId = '' }) => {
      const jsonMetadata = metadata ? ` :: ${JSON.stringify(metadata)}` : '';
      const reqId = requestId ? ` :: ${requestId}` : '';
      const ctx = context ? ` :: ${context}` : '';

      return `${timestamp} :: ${level} :: ${message}${ctx}${reqId}${jsonMetadata}`;
    });

    const httpFormatPrint = format.printf(({ level, message, timestamp, metadata }) => {
      const jsonMetadata = metadata ? `:: ${JSON.stringify(metadata)}` : '';
      return `${timestamp} :: ${level} :: ${message} ${jsonMetadata}`;
    });

    this.logger = createLogger({
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }), formatPrint),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: 'src/logs/info',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Backup logs to zipped files
          maxSize: '5m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }), formatPrint),
          level: 'info',
        }),
        new transports.DailyRotateFile({
          dirname: 'src/logs/error',
          filename: 'app-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Backup logs to zipped files
          maxSize: '5m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }), formatPrint),
          level: 'error',
        }),
        new transports.DailyRotateFile({
          dirname: 'src/logs/http',
          filename: 'app-%DATE%.http.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Backup logs to zipped files
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }), httpFormatPrint),
          level: 'http',
        }),
      ],
    });
  }

  log(message: string, params: IOptionsLoggerDto = {}) {
    this.logger.info(message, params);
  }

  error(message: string, params: IOptionsLoggerDto = {}) {
    this.logger.error(message, params);
  }

  http(message: string, params: IOptionsLoggerDto = {}) {
    this.logger.http(message, params);
  }
}

export default new AppLogger();
