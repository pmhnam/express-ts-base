import { NextFunction, Request, Response } from 'express';
import { ROLE_CODES } from '@utils/constants/enum';
import { i18nKey } from '../i18n/init.i18n';
import { jwtAuth } from './passport.middleware';
import { IJwtPayload } from '../jwt';

export const authorization =
  (allowedRoles = Object.values(ROLE_CODES)) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { role: currentRole } = req.user as IJwtPayload;
    if (!currentRole || !allowedRoles.includes(currentRole.code as ROLE_CODES)) {
      return res.status(403).json({ status: 403, message: req.t(i18nKey.auth.notAllowed) });
    }
    return next();
  };

export const auth4Admin = (req: Request, res: Response, next: NextFunction) =>
  jwtAuth(req, res, (err: unknown) => {
    if (err) return next(err);

    return authorization([ROLE_CODES.ADMIN])(req, res, next);
  });

export const auth4User = (req: Request, res: Response, next: NextFunction) =>
  jwtAuth(req, res, (err: unknown) => {
    if (err) return next(err);

    return authorization([ROLE_CODES.USER])(req, res, next);
  });

export const auth = jwtAuth;
