import { Router } from 'express';
import { validate } from 'express-validation';
import authController from './auth.controller';
import {
  forgotPasswordValidatorDto,
  loginValidatorDto,
  refreshTokenValidatorDto,
  registerValidatorDto,
  resetPasswordValidatorDto,
} from './auth.validate';

const authRouter = Router();

authRouter.post('/register', validate(registerValidatorDto), authController.register);
authRouter.post('/login', validate(loginValidatorDto), authController.login);
authRouter.post('/forgot-password', validate(forgotPasswordValidatorDto), authController.forgotPassword);
authRouter.post('/reset-password', validate(resetPasswordValidatorDto), authController.resetPassword);
authRouter.post('/refresh-access-token', validate(refreshTokenValidatorDto), authController.refreshAccessToken);

export default authRouter;
