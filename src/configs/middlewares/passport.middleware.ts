import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import { config } from 'dotenv';
import { IJwtPayload } from '@src/api/v1/utils/jwt';
import { Request } from 'express';

config();

const jwtStrategy = new Strategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY',
    issuer: process.env.JWT_ISSUER || 'hnam.id.vn',
    passReqToCallback: true,
  },
  (req: Request, payload: IJwtPayload, done) => {
    req.locals.isAuth = true;
    return done(null, payload);
  }
);

passport.use(jwtStrategy);

export const jwtAuth = passport.authenticate('jwt', { session: false });
