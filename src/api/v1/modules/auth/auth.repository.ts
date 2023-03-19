import { IUser, UserModel } from '@src/configs/database/models/user.model';
import mongoose, { ClientSession, FilterQuery, PipelineStage } from 'mongoose';
import { ICreateUser, IQueryOptions } from './auth.interface';

export class AuthRepo {
  private userModel: typeof UserModel;

  constructor() {
    this.userModel = UserModel;
  }

  // eslint-disable-next-line class-methods-use-this
  async startTransaction(): Promise<ClientSession> {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  }

  async create(user: ICreateUser): Promise<IUser> {
    return await this.userModel.create(user);
  }

  async deleteOne(query: FilterQuery<IUser>, options: IQueryOptions): Promise<boolean> {
    const { modifiedCount } = await this.userModel.updateOne(query, {
      deletedAt: new Date(),
      ...(options.deletedBy && { deletedBy: options.deletedBy }),
    });
    return modifiedCount === 1;
  }

  async deleteMany(query: FilterQuery<IUser>, options: IQueryOptions): Promise<number> {
    const { modifiedCount } = await this.userModel.updateMany(query, {
      deletedAt: new Date(),
      ...(options.deletedBy && { deletedBy: options.deletedBy }),
    });
    return modifiedCount;
  }

  async restoreOne(query: FilterQuery<IUser>): Promise<boolean> {
    const { modifiedCount } = await this.userModel.updateOne(query, { deletedAt: null, deletedBy: null });
    return modifiedCount === 1;
  }

  async findOne(query: FilterQuery<IUser>, options: IQueryOptions = { paranoid: true }): Promise<IUser | null> {
    return await this.userModel.findOne({ ...(options.paranoid && { deletedAt: null }), ...query });
  }

  async findById(id: string, options: IQueryOptions = { paranoid: true }): Promise<IUser | null> {
    return await this.userModel
      .findById(id)
      .where('deletedAt')
      .equals(options.paranoid ? null : { $exists: true });
  }

  async find(query: FilterQuery<IUser>, options: IQueryOptions = { paranoid: true }): Promise<IUser[]> {
    return await this.userModel
      .find(query)
      .where('deletedAt')
      .equals(options.paranoid ? null : { $exists: true });
  }

  async aggregate(pipeline: PipelineStage[], options: IQueryOptions = { paranoid: true }) {
    return this.userModel.aggregate([
      { $match: { deletedAt: options.paranoid ? null : { $exits: true } } },
      ...pipeline,
    ]);
  }
}
