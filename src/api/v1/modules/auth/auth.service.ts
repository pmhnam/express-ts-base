import { IUser } from '@src/configs/database/models/user.model';
import { ICreateUser } from './auth.interface';
import { AuthRepo } from './auth.repository';

export default class AuthService {
  private readonly authRepo: AuthRepo;

  constructor() {
    this.authRepo = new AuthRepo();
  }

  register = async (payload: ICreateUser): Promise<IUser> => {
    const t = await this.authRepo.startTransaction();
    try {
      const user = await this.authRepo.create(payload);
      await t.commitTransaction();
      return user;
    } catch (error) {
      await t.abortTransaction();
      console.error('> AuthService.register: ', error);
      throw error;
    } finally {
      t.endSession();
    }
  };
}
