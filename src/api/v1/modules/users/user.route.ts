import { Router } from 'express';
import { validate } from 'express-validation';

import { auth } from '../../middlewares/passport.middleware';
import { UserController } from './user.controller';
import { getUserByIdDto, getUsersValidatorDto, putUserByIdDto } from './user.validate';

const userRouter = Router();
const userController = new UserController();

userRouter
  .route('/:id')
  .get(validate(getUserByIdDto), userController.getUserById)
  .put(validate(putUserByIdDto), userController.updateUserById);
userRouter.get('/me/profile', auth, userController.getMyProfile);
userRouter.get('/', validate(getUsersValidatorDto), userController.getUsers);
userRouter.delete('/:id', auth, userController.deleteUserById);
userRouter.delete('/', auth, userController.deleteUsersByIds);

export default userRouter;
