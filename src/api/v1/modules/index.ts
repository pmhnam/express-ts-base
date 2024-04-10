import { Router } from 'express';
import authRouter from '@modulesV1/auth/auth.route';
import userRouter from '@modulesV1/users/user.route';

const routerV1 = Router();

routerV1.use('/auth', authRouter);
routerV1.use('/users', userRouter);

export default routerV1;
