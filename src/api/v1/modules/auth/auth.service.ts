/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
import { Request } from 'express';
import CoreService from '@src/core/module/core.service';
import { ICoreQueryParams } from '@src/utils/constants/interface';
import { BadRequestHTTP, NotFoundHTTP } from '@src/configs/httpException';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { i18nKey } from '@src/configs/i18n/init.i18n';
import UserModel, { IUserModel } from '@src/configs/database/models/user.model';
import { Op } from 'sequelize';
import jwt from '../../utils/jwt';
import { generateOTP } from '../../utils/functions';
import { ICreateUserDto, IForgotPasswordDto, ILoginDto } from './auth.interface';

class AuthService extends CoreService {
  private readonly userModel = UserModel;

  protected readonly params: ICoreQueryParams = {
    searchFields: [],
    sortFields: [],
    filterFields: [],
    dateScope: [],
    embed: {},
  };

  constructor() {
    super();
  }

  register = async (dto: ICreateUserDto) => {
    try {
      const { username = '', email = '' } = dto;

      const existedUser = await this.userModel.findOne({
        where: { [Op.or]: [{ username }, { email }] },
      });
      if (existedUser) throw new BadRequestHTTP(i18nKey.auth.userExisted);

      const user = await this.userModel.create(dto);
      return user;
    } catch (error) {
      console.error('> AuthService.register: ', error);
      throw error;
    }
  };

  login = async (dto: ILoginDto) => {
    try {
      const { username = '', email = '', password } = dto;

      const user = await this.userModel.findOne({
        where: { [Op.or]: [{ username }, { email }] },
        attributes: ['id', 'email', 'username', 'first_name', 'last_name', 'password'],
      });
      if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

      const { password: pws, ...restUser } = user.toJSON();

      const isMatch = bcrypt.compareSync(password, pws);
      if (!isMatch) throw new BadRequestHTTP(i18nKey.auth.loginFailed);

      const tokenPayload = { id: user.id, email: user.email, username: user.username };
      const tokens = jwt.sign(tokenPayload);
      // TODO: Save refresh token

      return { user: restUser, tokens };
    } catch (error) {
      console.error('> AuthService.login: ', error);
      throw error;
    }
  };

  forgotPassword = async (dto: IForgotPasswordDto) => {
    try {
      const { email = '', username = '' } = dto;
      const user = await this.userModel.findOne({ where: { [Op.or]: [{ username }, { email }] } });
      if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

      const otp = generateOTP();
      const expireMinutes = Number(process.env.OTP_EXPIRES_TIME || 5);
      const expires = moment().add(expireMinutes, 'minutes').toDate();

      await this.setForgotPasswordData(user.id, { otp, expires });

      return { otp, expires, email };
    } catch (error) {
      console.error('> AuthService.forgotPassword: ', error);
      throw error;
    }
  };

  resetPassword = async (req: Request) => {
    try {
      const { username = '', email = '', otp, newPassword } = req.body;

      const user = await this.userModel.findOne({ where: { [Op.or]: [{ username }, { email }] } });
      if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

      this.compareOtp(user, otp);
      await this.setResetPasswordData(user.id, { password: newPassword });

      return true;
    } catch (error) {
      console.error('> AuthService.resetPassword: ', error);
      throw error;
    }
  };

  private compareOtp(user: IUserModel, otp: string) {
    if (!user.reset_password) throw new NotFoundHTTP(i18nKey.auth.otpNotMatch);

    const isMatchOtp = user.forgot_password_code === otp;
    if (!isMatchOtp) throw new BadRequestHTTP(i18nKey.auth.otpNotMatch);

    const expireDate = user.forgot_password_code_expires && moment(user.forgot_password_code_expires);
    if (!expireDate || moment().isAfter(expireDate)) throw new BadRequestHTTP(i18nKey.auth.otpExpired);

    return true;
  }

  private async setForgotPasswordData(userId: string, { otp, expires }: { otp: string; expires: Date }) {
    return await this.userModel.update(
      {
        forgot_password_code: otp,
        forgot_password_code_expires: expires,
        reset_password: true,
      },
      { where: { id: userId } }
    );
  }

  private async setResetPasswordData(userId: string, { password }: { password: string }) {
    return await this.userModel.update(
      {
        forgot_password_code: undefined,
        forgot_password_code_expires: undefined,
        reset_password: false,
        password,
      },
      { where: { id: userId } }
    );
  }
}

export default new AuthService();
