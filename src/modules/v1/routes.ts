import { Router } from 'express';
import authRouter from '@modules/v1/auth/auth.routes';
import userRouter from '@modules/v1/users/user.routes';

const routerV1 = Router();

routerV1.use('/auth', authRouter);
routerV1.use('/users', userRouter);

export default routerV1;
