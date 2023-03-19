import { NextFunction, Request, Response } from 'express';
import messageQueue from '@src/configs/queue';
import { QUEUE_SEND_MESSAGE } from '@src/configs/queue/channels';
import AuthService from './auth.service';
import AuthValidate from './auth.validate';

export default class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = AuthValidate.PostRegister(req);
      const user = await this.authService.register(payload);
      // gửi OTP
      await messageQueue.sendToQueue(QUEUE_SEND_MESSAGE, user);
      res.status(201).json({
        message: 'User created successfully',
        data: user,
      });
      return;
    } catch (error) {
      next(error);
    }
  };
}
