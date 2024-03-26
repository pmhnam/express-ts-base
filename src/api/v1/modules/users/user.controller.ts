import { NextFunction, Request, Response } from 'express';
import userService from './user.service';

export class UserController {
  private readonly userService = userService;

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.onSuccess(user);
    } catch (error) {
      next(error);
    }
  };

  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id as string;
      const user = await this.userService.getUserById(id);
      res.onSuccess(user);
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id as string;
      const dto = req.body;
      const user = await this.userService.updateUserById(id, dto);
      res.onSuccess(user);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { users, metadata } = await this.userService.getUsers(req);
      res.onSuccess(users, { metadata });
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.deleteUserById(id);
      res.onSuccess(user);
    } catch (error) {
      next(error);
    }
  };

  deleteUsersByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const users = await this.userService.deleteUsersByIds(ids);
      res.onSuccess(users);
    } catch (error) {
      next(error);
    }
  };
}
