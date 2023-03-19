export class HttpException extends Error {
  public statusCode: number;
  public message: string;

  constructor(message: string, status: number) {
    super();

    this.statusCode = status;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}
