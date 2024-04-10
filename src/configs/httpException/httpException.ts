import { IOptionsLoggerDto } from '@configs/logger';

export class HTTPException extends Error {
  public statusCode: number;
  public message: string;
  public options?: IOptionsLoggerDto;

  constructor(message: string, status: number, opts?: IOptionsLoggerDto) {
    super();

    this.statusCode = status;
    this.message = message;
    this.options = opts;

    Error.captureStackTrace(this, this.constructor);
  }
}
