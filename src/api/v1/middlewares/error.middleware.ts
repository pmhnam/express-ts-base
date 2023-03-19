import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../utils/http-exception';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Server error';
  return res.status(status).json({
    status,
    message,
  });
};
