import { Request, Response } from 'express';
import { HTTPException } from '../httpException';

export const errorHandler = (err: HTTPException, req: Request, res: Response) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Server error';
  return res.status(status).json({ status, message });
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({ status: 404, message: 'Page Not Found' });
};
