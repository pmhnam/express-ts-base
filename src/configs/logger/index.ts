import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

class AppLogger {
  public logger: Logger;
  constructor() {
    const formatPrint = format.printf(({ level, message, context, timestamp, metadata, requestId }) => {
      const jsonMetadata = metadata ? `::${JSON.stringify(metadata)}` : '';
      return `${timestamp}::${level}::${message}::${context}::${requestId}::${jsonMetadata}`;
    });

    const httpFormatPrint = format.printf(({ level, message, timestamp, metadata }) => {
      const jsonMetadata = metadata ? `::${JSON.stringify(metadata)}` : '';
      return `${timestamp}::${level}::${message}${jsonMetadata}`;
    });

    this.logger = createLogger({
      format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
      transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: 'app-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Backup logs to zipped files
          maxSize: '5m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
          level: 'info',
        }),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: 'app-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Backup logs to zipped files
          maxSize: '5m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatPrint),
          level: 'error',
        }),
        new transports.DailyRotateFile({
          dirname: 'src/logs',
          filename: 'app-%DATE%.http.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true, // Backup logs to zipped files
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), httpFormatPrint),
          level: 'http',
        }),
      ],
    });
  }

  log(message: string, params: Record<string, unknown> = {}) {
    this.logger.info({ message, ...params });
  }

  error(message: string, params: Record<string, unknown> = {}) {
    this.logger.error({ message, ...params });
  }

  http(message: string, params: Record<string, unknown> = {}) {
    this.logger.http({ message, ...params });
  }
}

export default new AppLogger();
