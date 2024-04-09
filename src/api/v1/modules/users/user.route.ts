import { Router } from 'express';
import { validate } from 'express-validation';

import { jwtAuth } from '@src/configs/middlewares/passport.middleware';
import { auth, auth4Admin } from '@src/configs/middlewares/authorization.middleware';
import { UserController } from './user.controller';
import { getUserByIdDto, getUsersValidatorDto, putUserByIdDto } from './user.validate';

const userRouter = Router();
const userCtl = new UserController();

userRouter.get('/me', auth, userCtl.getMyProfile);
userRouter
  .route('/:id')
  .get(auth, validate(getUserByIdDto), userCtl.cacheMiddleware, userCtl.getUserById)
  .put(jwtAuth, auth, validate(putUserByIdDto), userCtl.updateUserById)
  .delete(jwtAuth, auth4Admin, validate(putUserByIdDto), userCtl.deleteUserById);
userRouter.get('/', jwtAuth, auth4Admin, validate(getUsersValidatorDto), userCtl.cacheMiddleware, userCtl.getUsers);
userRouter.delete('/', auth4Admin, jwtAuth, userCtl.deleteUsersByIds);

export default userRouter;
