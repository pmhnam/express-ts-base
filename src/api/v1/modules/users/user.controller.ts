import { NextFunction, Request, Response } from 'express';
import { CoreController } from '@src/core/module/core.controller';
import userService from './user.service';

export class UserController extends CoreController {
  private readonly userService = userService;

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.userService.getUserById(id);
      await this.setCache(req.originalUrl, data);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id as string;
      const data = await this.userService.getUserById(id);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  updateUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedBy = req.user?.id as string;
      const { id } = req.params;
      const dto = req.body;
      const data = await this.userService.updateUserById(id, { ...dto, updatedBy });
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { users, metadata } = await this.userService.getUsers(req);
      await this.setCache(req.originalUrl, users, { metadata });
      res.onSuccess(users, { metadata });
    } catch (error) {
      next(error);
    }
  };

  deleteUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deletedBy = req.user?.id as string;
      const data = await this.userService.deleteUserById(id, deletedBy);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };

  deleteUsersByIds = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids } = req.body;
      const deletedBy = req.user?.id as string;
      const data = await this.userService.deleteUsersByIds(ids, deletedBy);
      res.onSuccess(data);
    } catch (error) {
      next(error);
    }
  };
}
