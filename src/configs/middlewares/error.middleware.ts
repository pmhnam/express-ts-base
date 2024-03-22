/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import { HTTPException } from '../httpException';
import { i18nKey } from '../i18n/init.i18n';
import logger from '../logger';

export const errorHandler = (err: HTTPException, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    const { message } = Object.values(err.details).flat()[0];
    return res.status(400).json({ status: 400, message });
  }

  const status = err.statusCode || 500;
  const message = req.t(err.message) || req.t(i18nKey.internalServerError);
  logger.error(message, err.options);
  return res.status(status).json({ status, message });
};

export const notFoundHandler = (err: HTTPException, req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ status: 404, message: req.t(i18nKey.notFound) });
};
