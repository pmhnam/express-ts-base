import { NextFunction, Request, Response } from 'express';
import authService from './auth.service';

class AuthController {
  private readonly authService;

  constructor() {
    this.authService = authService;
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body;
      const data = await this.authService.register(dto);
      // TODO: send email
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
      const data = await this.authService.resetPassword(req);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();
