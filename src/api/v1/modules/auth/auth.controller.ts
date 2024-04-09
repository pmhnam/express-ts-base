import { NextFunction, Request, Response } from 'express';
import jwt from '@src/configs/jwt';
import { BadRequestHTTP } from '@src/configs/httpException';
import { i18nKey } from '@src/configs/i18n/init.i18n';
import authService from './auth.service';
import { CoreController } from '../../core/core.controller';
import { sendMail } from '../../utils/func';
import { IVerifyEmailDto } from './auth.interface';

class AuthController extends CoreController {
  private readonly authService;

  constructor() {
    super();
    this.authService = authService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body;
      const data = await this.authService.register(dto);
      const { otp, expireMinutes } = await this.authService.generateOTP(data.user.id);
      // TODO: send email
      sendMail({
        to: data.user.email,
        subject: 'Verify your Email',
        html: `<p>You need to verify your email address to continue using app</p></br>
          <p>OTP: <span>${otp}</span> </p></br>
          <p>Expires in ${expireMinutes} minutes</p>`,
      });

      res.onSuccess(data, { code: 201 });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body;
      const data = await this.authService.login(dto);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body;
      const data = await this.authService.forgotPassword(dto);
      // TODO: send email
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.authService.resetPassword(req.body);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const { id } = jwt.verifyRefreshToken(refreshToken);
      const redisSessionKey = `session:${id}`;
      const session = await this.getCache(redisSessionKey);
      if (!session) throw new BadRequestHTTP(i18nKey.auth.tokenExpired);

      const data = await this.authService.refreshAccessToken(id);
      data.tokens.refreshToken = refreshToken;
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.query as unknown as IVerifyEmailDto;
      await this.authService.verifyEmail(dto);
      res.status(200).send('Email verified successfully');
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
