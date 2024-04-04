import { Router } from 'express';
import { validate } from 'express-validation';

import { jwtAuth } from '@src/configs/middlewares/passport.middleware';
import { UserController } from './user.controller';
import { getUserByIdDto, getUsersValidatorDto, putUserByIdDto } from './user.validate';

const userRouter = Router();
const userCtl = new UserController();

userRouter.get('/me', jwtAuth, userCtl.getMyProfile);
userRouter
  .route('/:id')
  .get(validate(getUserByIdDto), userCtl.cacheMiddleware, userCtl.getUserById)
  .put(jwtAuth, validate(putUserByIdDto), userCtl.updateUserById)
  .delete(jwtAuth, validate(putUserByIdDto), userCtl.deleteUserById);
userRouter.get('/', validate(getUsersValidatorDto), userCtl.cacheMiddleware, userCtl.getUsers);
userRouter.delete('/', jwtAuth, userCtl.deleteUsersByIds);

export default userRouter;
