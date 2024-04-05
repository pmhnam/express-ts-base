import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import { config } from 'dotenv';
import { IJwtPayload } from '@src/api/v1/utils/jwt';
import { Request } from 'express';
import { RoleModel, UserModel } from '../database/models';
import { UnauthorizedHTTP } from '../httpException';
import { i18nKey } from '../i18n/init.i18n';

config();

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY',
    issuer: process.env.JWT_ISSUER || 'hnam.id.vn',
    passReqToCallback: true,
  },
  async (req: Request, payload: IJwtPayload, done) => {
    req.locals = { ...req.locals, isAuth: true };
    const user = await UserModel.findByPk(payload.id, {
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phoneNumber', 'status'],
      include: [
        {
          model: RoleModel,
          as: 'role',
        },
      ],
    });
    if (!user) return done(new UnauthorizedHTTP(i18nKey.auth.userNotFound), false);
    return done(null, user);
  }
);

passport.use(jwtStrategy);

export const jwtAuth = passport.authenticate('jwt', { session: false });