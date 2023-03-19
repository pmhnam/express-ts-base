import { NextFunction, Request, Response } from 'express';

export interface CustomSuccess {
  message?: string;
  code?: number;
}

export default class ResponseHandler {
  static middlewareResponse(req: Request, res: Response, next: NextFunction) {
    res.onSuccess = ResponseHandler.setDefaultResponse(res).onSuccess;
    return next();
  }

  static setDefaultResponse(res: Response) {
    return {
      onSuccess: (data: unknown, custom: CustomSuccess) => {
        const { message = 'Success', code = 200 } = custom;
        return res.status(code).json({ message, data });
      },
    };
  }
}
