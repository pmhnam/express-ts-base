import { NextFunction, Request, Response } from 'express';
import { i18nKey } from '@src/configs/i18n/init.i18n';
import { UnauthorizedHTTP } from '@src/configs/httpException';
import jwt, { IJwtPayload } from '../utils/jwt';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(new UnauthorizedHTTP(i18nKey.auth.missingToken));
    }

    const [authType, token] = authorizationHeader.split(' ');
    if (authType !== 'Bearer' || !token) {
      return next(new UnauthorizedHTTP(i18nKey.auth.invalidTokenType));
    }

    const decoded = jwt.verifyAccessToken(token) as IJwtPayload;
    req.user = decoded;
    req.requestId = decoded.id;

    return next();
  } catch (error) {
    return next(error);
  }
};
