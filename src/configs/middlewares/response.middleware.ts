import { NextFunction, Request, Response } from 'express';
import { i18nKey } from '../i18n/init.i18n';

export interface CustomSuccess {
  message?: string;
  code?: number;
}

export default class ResponseHandler {
  static middlewareResponse(req: Request, res: Response, next: NextFunction) {
    res.onSuccess = ResponseHandler.setDefaultResponse(req, res).onSuccess;
    return next();
  }

  static setDefaultResponse(req: Request, res: Response) {
    return {
      onSuccess: (data: unknown, custom: CustomSuccess = {}) => {
        const { message = i18nKey.success, code = 200 } = custom;
        return res.status(code).json({ message: req.t(message), data });
      },
    };
  }
}
