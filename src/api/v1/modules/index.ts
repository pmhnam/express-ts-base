import { Router } from 'express';
import authRouter from './auth/auth.route';
import userRouter from './users/user.route';

const routerV1 = Router();

routerV1.use('/auth', authRouter);
routerV1.use('/users', userRouter);

export default routerV1;
