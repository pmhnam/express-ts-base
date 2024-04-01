import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../middlewares/passport.middleware';
import { UserController } from './user.controller';
import { getUserByIdDto, getUsersValidatorDto, putUserByIdDto } from './user.validate';

const userRouter = Router();
const userCtl = new UserController();

userRouter.get('/me', auth, userCtl.getMyProfile);
userRouter
  .route('/:id')
  .get(validate(getUserByIdDto), userCtl.cacheMiddleware, userCtl.getUserById)
  .put(auth, validate(putUserByIdDto), userCtl.updateUserById)
  .delete(auth, validate(putUserByIdDto), userCtl.deleteUserById);
userRouter.get('/', validate(getUsersValidatorDto), userCtl.cacheMiddleware, userCtl.getUsers);
userRouter.delete('/', auth, userCtl.deleteUsersByIds);

export default userRouter;
