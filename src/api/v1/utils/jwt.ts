import { sign, verify, Secret, VerifyOptions } from 'jsonwebtoken';
import { config } from 'dotenv';
import { UnauthorizedHTTP } from '@src/configs/httpException';
import { i18nKey } from '@src/configs/i18n/init.i18n';

config();

export interface IJwtPayload {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export class JWT {
  private readonly accessSecretKey: Secret = process.env.JWT_SECRET_KEY || '';
  private readonly refreshSecretKey: Secret = process.env.JWT_REFRESH_SECRET_KEY || '';
  private readonly accessExpiresTime: number = Number(process.env.JWT_EXPIRES_TIME) || 30 * 60;
  private readonly refreshExpiresTime: number = Number(process.env.JWT_REFRESH_EXPIRES_TIME) || 7 * 24 * 60 * 60;

  public sign(payload: IJwtPayload) {
    const accessToken = sign(payload, this.accessSecretKey, { expiresIn: this.accessExpiresTime });
    const refreshToken = sign(payload, this.refreshSecretKey, { expiresIn: this.refreshExpiresTime });
    return { accessToken, refreshToken };
  }

  public verifyAccessToken(token: string, options?: VerifyOptions) {
    try {
      return verify(token, this.accessSecretKey, options);
    } catch (error) {
      throw new UnauthorizedHTTP(i18nKey.auth.invalidToken, { context: 'verifyAccessToken' });
    }
  }
  public verifyRefreshToken(token: string, options?: VerifyOptions) {
    try {
      return verify(token, this.refreshSecretKey, options);
    } catch (error) {
      throw new UnauthorizedHTTP(i18nKey.auth.invalidToken, { context: 'verifyRefreshToken' });
    }
  }
}

export default new JWT();
