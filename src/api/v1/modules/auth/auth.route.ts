import { Router } from 'express';
import AuthService from './auth.service';
import AuthController from './auth.controller';

const authRouter = Router();

const authService = new AuthService();
const authController = new AuthController(authService);

authRouter.post('/register', authController.register);

export default authRouter;