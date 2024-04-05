import { sign, verify, Secret, VerifyOptions } from 'jsonwebtoken';
import { config } from 'dotenv';
import { UnauthorizedHTTP } from '@src/configs/httpException';
import { i18nKey } from '@src/configs/i18n/init.i18n';
import { setCache } from '@src/configs/database/redis/cache';
import { IUserModel } from '@src/configs/database/models/user.model';

config();

export interface IJwtPayload
  extends Pick<
    IUserModel,
    'id' | 'username' | 'email' | 'firstName' | 'lastName' | 'phoneNumber' | 'status' | 'role'
  > {}

export class JWT {
  private readonly issuer = process.env.JWT_ISSUER || 'hnam.id.vn';
  private readonly accessSecretKey: Secret = process.env.JWT_SECRET_KEY || '';
  private readonly refreshSecretKey: Secret = process.env.JWT_REFRESH_SECRET_KEY || '';
  private readonly accessExpiresTime: number = Number(process.env.JWT_EXPIRES_TIME) || 30 * 60;
  private readonly refreshExpiresTime: number = Number(process.env.JWT_REFRESH_EXPIRES_TIME) || 7 * 24 * 60 * 60;

  public sign(payload: IJwtPayload) {
    const redisSessionKey = `session:${payload.id}`;
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    setCache(redisSessionKey, { id: payload.id, refreshToken }, this.refreshExpiresTime);
    return { accessToken, refreshToken };
  }

  signAccessToken(payload: IJwtPayload) {
    const accessToken = sign(payload, this.accessSecretKey, {
      expiresIn: this.accessExpiresTime,
      issuer: this.issuer,
    });
    return accessToken;
  }

  signRefreshToken(payload: IJwtPayload) {
    const refreshToken = sign(payload, this.refreshSecretKey, {
      expiresIn: this.refreshExpiresTime,
      issuer: this.issuer,
    });
    return refreshToken;
  }

  public verifyAccessToken(token: string, options?: VerifyOptions) {
    try {
      return verify(token, this.accessSecretKey, { ...options, issuer: this.issuer });
    } catch (error) {
      throw new UnauthorizedHTTP(i18nKey.auth.invalidToken, { context: 'verifyAccessToken' });
    }
  }
  public verifyRefreshToken(token: string, options?: VerifyOptions) {
    try {
      return verify(token, this.refreshSecretKey, { ...options, issuer: this.issuer });
    } catch (error) {
      throw new UnauthorizedHTTP(i18nKey.auth.invalidToken, { context: 'verifyRefreshToken' });
    }
  }
}

export default new JWT();
