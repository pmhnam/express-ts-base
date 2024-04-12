/* eslint-disable no-underscore-dangle */
import { ExtractJwt, Strategy } from 'passport-jwt';
import passport from 'passport';
import { config } from 'dotenv';
import { Request } from 'express';
import { InternalServerHTTP, UnauthorizedHTTP } from '@configs/httpException';
import { RoleModel, UserModel } from '@models';
import { i18nKey } from '@configs/i18n/init.i18n';
import { IJwtPayload } from '@configs/jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ACCOUNT_STATUS, ROLE_CODES } from '@src/utils/constants/enum';

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

const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/v1/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    const jsonData = profile._json;
    let user = await UserModel.findOne({
      where: { email: jsonData.email },
      attributes: ['id', 'username', 'email', 'firstName', 'lastName', 'phoneNumber', 'status'],
      include: [
        {
          model: RoleModel,
          as: 'role',
          attributes: ['id', 'code', 'name'],
        },
      ],
    });
    if (!user) {
      const { sub, given_name, family_name, picture, email, email_verified } = jsonData;
      const userRole = await RoleModel.findOne({ where: { code: ROLE_CODES.USER } });
      if (!userRole) throw new InternalServerHTTP(i18nKey.internalServerError);
      user = await UserModel.create(
        {
          email: email!,
          username: sub,
          firstName: given_name!,
          lastName: family_name!,
          emailVerified: email_verified === 'true',
          picture,
          status: ACCOUNT_STATUS.ACTIVE,
          roleId: userRole.id,
        },
        { include: [{ model: RoleModel, as: 'role', attributes: ['id', 'code', 'name'] }] }
      );
    }
    return done(null, user);
  }
);

passport.use(jwtStrategy);
passport.use(googleStrategy);

export const jwtAuth = passport.authenticate('jwt', { session: false });
export const googleLogin = passport.authenticate('google', { scope: ['email', 'profile'] });
export const googleAuth = passport.authenticate('google', { session: false });
