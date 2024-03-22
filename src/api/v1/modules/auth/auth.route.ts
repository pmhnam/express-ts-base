import { Router } from 'express';
import { validate } from 'express-validation';
import authController from './auth.controller';
import {
  forgotPasswordValidatorDto,
  loginValidatorDto,
  registerValidatorDto,
  resetPasswordValidatorDto,
} from './auth.validate';
import { auth } from '../../middlewares/passport.middleware';

const authRouter = Router();

authRouter.post('/register', validate(registerValidatorDto), authController.register);
authRouter.post('/login', validate(loginValidatorDto), authController.login);
authRouter.post('/forgot-password', auth, validate(forgotPasswordValidatorDto), authController.forgotPassword);
authRouter.post('/reset-password', validate(resetPasswordValidatorDto), authController.resetPassword);

export default authRouter;
