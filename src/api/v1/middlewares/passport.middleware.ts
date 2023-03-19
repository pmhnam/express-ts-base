import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../utils/http-exception';
import jwt from '../utils/jwt';

export const jwtAuthentication = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.locals.isAuth = false;
    const auth_type = req.headers?.authorization?.split(' ')[0];
    const token = req.headers?.authorization?.split(' ')[1];
    if (auth_type !== 'Bearer' || !token) {
      throw new HttpException('Invalid token', 401);
    }
    const decoded = jwt.verify(token);
    next();
  } catch (error) {
    next(error);
  }
};
