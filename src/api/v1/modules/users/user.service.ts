import UserModel from '@src/configs/database/models/user.model';
import CoreService from '@src/core/module/core.service';
import { ICoreQueryParams } from '@src/utils/constants/interface';
import { Request } from 'express';
import { Op } from 'sequelize';
import { IUpdateUserDto } from './user.interface';

class UserService extends CoreService {
  private readonly userModel;
  protected params: ICoreQueryParams = {
    searchFields: ['username', 'email'],
    sortFields: ['username', 'email', 'first_name', 'last_name', 'created_at', 'updated_at'],
    filterFields: ['username', 'email', 'first_name', 'last_name'],
    dateScope: [],
    embed: {},
  };

  constructor() {
    super();
    this.userModel = UserModel;
  }

  async getUserById(id: string) {
    return await this.userModel.findByPk(id, {
      attributes: {
        exclude: [
          'password',
          'otp',
          'otp_expires',
          'forgot_password_code',
          'forgot_password_code_expires',
          'reset_password',
          'secret_2fa',
          'deletedAt',
        ],
      },
    });
  }

  async updateUserById(id: string, dto: IUpdateUserDto) {
    const user = await this.getUserById(id);
    if (!user) throw new Error('User not found');

    return await this.userModel.update(dto, { where: { id } });
  }

  async getUsers(req: Request) {
    const queryParams = this.getParams(req.query);

    const { rows: users, count } = await this.userModel.findAndCountAll({
      ...queryParams,
      attributes: {
        exclude: [
          'password',
          'otp',
          'otp_expires',
          'forgot_password_code',
          'forgot_password_code_expires',
          'reset_password',
          'secret_2fa',
          'deletedAt',
        ],
      },
    });

    const metadata = this.getMetadata(count);
    return { users, metadata };
  }

  async deleteUserById(id: string) {
    const user = await this.getUserById(id);
    if (!user) throw new Error('User not found');
    return await user.destroy();
  }

  async deleteUsersByIds(ids: string[]) {
    const users = await this.userModel.findAll({ where: { id: { [Op.in]: ids } } });
    if (users.length !== ids.length) throw new Error('User not found');
    return await this.userModel.destroy({ where: { id: { [Op.in]: ids } } });
  }
}

export default new UserService();
