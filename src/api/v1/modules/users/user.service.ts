import CoreService from '@src/core/module/core.service';
import { ICoreQueryParams } from '@src/utils/constants/interface';
import { Request } from 'express';
import { Op, Transaction } from 'sequelize';
import { NotFoundHTTP } from '@src/configs/httpException';
import { i18nKey } from '@src/configs/i18n/init.i18n';
import { UserModel } from '@src/configs/database/models';
import { IUpdateUserDto } from './user.interface';

class UserService extends CoreService {
  private readonly userModel;
  protected params: ICoreQueryParams = {
    searchFields: ['username', 'email'],
    sortFields: ['username', 'email', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
    filterFields: ['username', 'email', 'firstName', 'lastName'],
    dateScope: [],
    embed: {},
  };

  constructor() {
    super();
    this.userModel = UserModel;
  }

  async getUserById(id: string, transaction?: Transaction) {
    const user = await this.userModel.findByPk(id, {
      attributes: {
        exclude: [
          'password',
          'otp',
          'otpExpires',
          'forgotPasswordCode',
          'forgotPasswordCodeExpires',
          'resetPassword',
          'secret2fa',
          'deletedAt',
        ],
      },
      transaction,
    });
    if (!user) throw new NotFoundHTTP(i18nKey.users.userNotFound);

    return user;
  }

  async updateUserById(id: string, dto: IUpdateUserDto) {
    await this.getUserById(id);
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
          'otpExpires',
          'forgotPasswordCode',
          'forgotPasswordCodeExpires',
          'resetPassword',
          'secret2fa',
          'deletedAt',
        ],
      },
    });

    const metadata = this.getMetadata(count);
    return { users, metadata };
  }

  async deleteUserById(id: string, deletedBy: string) {
    const transaction = await this.getTransaction();
    try {
      const user = await this.getUserById(id);
      await this.userModel.update({ deletedBy }, { where: { id }, transaction });
      await user.destroy({ transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteUsersByIds(ids: string[], deletedBy: string) {
    const transaction = await this.getTransaction();
    try {
      const users = await this.userModel.findAll({ where: { id: { [Op.in]: ids } }, transaction });
      if (users.length !== ids.length) throw new Error('User not found');
      await this.userModel.update({ deletedBy }, { where: { id: { [Op.in]: ids } }, transaction });
      await this.userModel.destroy({ where: { id: { [Op.in]: ids } }, transaction });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new UserService();
