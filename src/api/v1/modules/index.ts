import { Router } from 'express';
import authRouter from './auth/auth.route';

const routerV1 = Router();

routerV1.use('/auth', authRouter);

export default routerV1;
