import { ICoreQueryParams } from '@utils/constants/interface';
import { Request } from 'express';
import { Op, Transaction } from 'sequelize';
import { NotFoundHTTP } from '@configs/httpException';
import { i18nKey } from '@configs/i18n/init.i18n';
import { RoleModel, UserModel } from '@models';
import CoreService from '@modules/v1/core/core.service';
import { IUpdateUserDto } from './user.interface';

class UserService extends CoreService {
  private readonly userModel;
  private readonly roleModel;
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
    this.roleModel = RoleModel;
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
      include: [
        {
          model: this.roleModel,
          as: 'role',
          attributes: ['id', 'code', 'name'],
        },
      ],
      transaction,
    });
    if (!user) throw new NotFoundHTTP(i18nKey.users.userNotFound);

    return user;
  }

  async updateUserById(id: string, dto: IUpdateUserDto, transaction?: Transaction) {
    const user = await this.getUserById(id, transaction);
    return await user.update(dto, { transaction });
  }

  async getUsers(query: Request['query'], transaction?: Transaction) {
    const queryParams = this.getParams(query);

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
      transaction,
    });

    const metadata = this.getMetadata(count);
    return { users, metadata };
  }

  async deleteUserById(id: string, deletedBy: string, force = false) {
    const transaction = await this.getTransaction();
    try {
      const user = await this.getUserById(id);
      await user.update({ deletedBy }, { transaction });
      await user.destroy({ transaction, force });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteUsersByIds(ids: string[], deletedBy: string, force = false) {
    const transaction = await this.getTransaction();
    try {
      const users = await this.userModel.findAll({ where: { id: { [Op.in]: ids } }, transaction });
      if (users.length !== ids.length) throw new Error('User not found');
      await this.userModel.update({ deletedBy }, { where: { id: { [Op.in]: ids } }, transaction });
      await this.userModel.destroy({ where: { id: { [Op.in]: ids } }, transaction, force });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new UserService();
