/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
import { ICoreQueryParams } from '@utils/constants/interface';
import { BadRequestHTTP, InternalServerHTTP, NotFoundHTTP } from '@configs/httpException';
import bcrypt from 'bcryptjs';
import moment from 'moment';
import { i18nKey } from '@configs/i18n/init.i18n';
import { IUserModel } from '@models/user.model';
import { Op, Transaction } from 'sequelize';
import { RoleModel, UserModel } from '@models';
import { ACCOUNT_STATUS, ROLE_CODES } from '@utils/constants/enum';
import jwt, { IJwtPayload } from '@configs/jwt';
import { generateOTP } from '@utils/func';
import _ from 'lodash';
import CoreService from '@modules/v1/core/core.service';
import { ICreateUserDto, IForgotPasswordDto, ILoginDto, IVerifyEmailDto } from './auth.interface';

class AuthService extends CoreService {
  private readonly userModel = UserModel;
  private readonly roleModel = RoleModel;

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

  async register(dto: ICreateUserDto, transaction?: Transaction) {
    const { username = '', email = '' } = dto;

    const existedUser = await this.userModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
      transaction,
    });
    if (existedUser) throw new BadRequestHTTP(i18nKey.auth.userExisted);

    const userRole = await this.roleModel.findOne({ where: { code: ROLE_CODES.USER }, transaction });
    if (!userRole) throw new InternalServerHTTP(i18nKey.internalServerError);

    const user = await this.userModel.create(
      { ...dto, roleId: userRole.id },
      {
        include: [
          {
            model: this.roleModel,
            as: 'role',
          },
        ],
        transaction,
      }
    );
    const tokens = this.signTokens(user);
    const jsonUser = _.omit(user.toJSON(), [
      'password',
      'otp',
      'otpExpires',
      'forgotPasswordCode',
      'forgotPasswordCodeExpires',
      'resetPassword',
      'secret2fa',
      'deletedAt',
      'deletedBy',
      'updatedBy',
    ]);

    return { user: jsonUser, tokens };
  }

  async login(dto: ILoginDto, transaction?: Transaction) {
    const { username = '', email = '', password } = dto;

    const user = await this.userModel.findOne({
      where: { [Op.or]: [{ username }, { email }] },
      attributes: {
        exclude: [
          'otp',
          'otpExpires',
          'forgotPasswordCode',
          'forgotPasswordCodeExpires',
          'resetPassword',
          'secret2fa',
          'deletedAt',
          'deletedBy',
          'updatedBy',
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
    if (!user) throw new NotFoundHTTP(i18nKey.auth.wrongUsernameOrPassword);

    const { password: pws, ...restUser } = user.toJSON();

    const isMatch = bcrypt.compareSync(password, pws);
    if (!isMatch) throw new BadRequestHTTP(i18nKey.auth.wrongUsernameOrPassword);

    const tokens = this.signTokens(user);

    return { user: restUser, tokens };
  }

  async forgotPassword(dto: IForgotPasswordDto, transaction?: Transaction) {
    const { email = '', username = '' } = dto;
    const user = await this.userModel.findOne({ where: { [Op.or]: [{ username }, { email }] }, transaction });
    if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

    const otp = generateOTP();
    const expireMinutes = Number(process.env.OTP_EXPIRES_TIME || 5);
    const expires = moment().add(expireMinutes, 'minutes').toDate();

    await this.setForgotPasswordData(user.id, { otp, expires }, transaction);

    return { otp, expires, email: user.email };
  }

  async resetPassword(
    dto: { email?: string; username?: string; otp: string; newPassword: string },
    transaction?: Transaction
  ) {
    const { username = '', email = '', otp, newPassword } = dto;

    const user = await this.userModel.findOne({ where: { [Op.or]: [{ username }, { email }] }, transaction });
    if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

    this.compareOtp(user, otp);
    await this.setResetPasswordData(user.id, { password: newPassword }, transaction);

    return true;
  }

  async refreshAccessToken(userId: string, transaction?: Transaction) {
    const user = await this.userModel.findOne({
      where: { id: userId },
      attributes: ['id', 'email', 'username', 'firstName', 'lastName', 'phoneNumber', 'status'],
      include: [
        {
          model: this.roleModel,
          as: 'role',
          attributes: ['id', 'code', 'name'],
        },
      ],
      transaction,
    });
    if (!user) throw new BadRequestHTTP(i18nKey.auth.invalidToken);

    const accessToken = this.signAccessTokens(user);
    return { user, tokens: { accessToken, refreshToken: '' } };
  }

  async generateOTP(id: string, transaction?: Transaction) {
    const user = await this.userModel.findOne({ where: { id }, transaction });
    if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

    const otp = generateOTP();
    const expireMinutes = Number(process.env.OTP_EXPIRES_TIME || 5);
    const expires = moment().add(expireMinutes, 'minutes').toDate();

    user.otp = otp;
    user.otpExpires = expires;
    await user.save({ transaction });

    return { otp, expireMinutes };
  }

  async verifyEmail({ email, otp }: IVerifyEmailDto, transaction?: Transaction) {
    const user = await this.userModel.findOne({ where: { email }, transaction });
    if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

    if (user.otp !== otp) throw new BadRequestHTTP(i18nKey.auth.otpNotMatch);
    if (moment().isAfter(user.otpExpires)) throw new BadRequestHTTP(i18nKey.auth.otpExpired);

    user.otp = undefined;
    user.otpExpires = undefined;
    user.emailVerified = true;
    user.status = ACCOUNT_STATUS.ACTIVE;
    await user.save({ transaction });

    return user;
  }

  async loginWithGoogle(dto: IJwtPayload) {
    const user = await this.userModel.findOne({
      where: { email: dto.email },
      attributes: {
        exclude: [
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
    });
    if (!user) throw new NotFoundHTTP(i18nKey.auth.userNotFound);

    const tokens = this.signTokens(user);
    const jsonUser = _.omit(user.toJSON(), [
      'password',
      'otp',
      'otpExpires',
      'forgotPasswordCode',
      'forgotPasswordCodeExpires',
      'resetPassword',
      'secret2fa',
      'deletedAt',
      'deletedBy',
      'updatedBy',
    ]);

    return { user: jsonUser, tokens };
  }

  // #region private methods
  private compareOtp(user: IUserModel, otp: string) {
    if (!user.resetPassword) throw new BadRequestHTTP(i18nKey.auth.otpNotMatch);

    const isMatchOtp = user.forgotPasswordCode === otp;
    if (!isMatchOtp) throw new BadRequestHTTP(i18nKey.auth.otpNotMatch);

    const expireDate = user.forgotPasswordCodeExpires && moment(user.forgotPasswordCodeExpires);
    if (!expireDate || moment().isAfter(expireDate)) throw new BadRequestHTTP(i18nKey.auth.otpExpired);

    return true;
  }

  private async setForgotPasswordData(
    userId: string,
    { otp, expires }: { otp: string; expires: Date },
    transaction?: Transaction
  ) {
    return await this.userModel.update(
      {
        forgotPasswordCode: otp,
        forgotPasswordCodeExpires: expires,
        resetPassword: true,
      },
      { where: { id: userId }, transaction }
    );
  }

  private async setResetPasswordData(userId: string, { password }: { password: string }, transaction?: Transaction) {
    return await this.userModel.update(
      {
        forgotPasswordCode: undefined,
        forgotPasswordCodeExpires: undefined,
        resetPassword: false,
        password,
      },
      { where: { id: userId }, transaction }
    );
  }

  private signTokens(user: IUserModel) {
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    return jwt.sign(tokenPayload);
  }

  private signAccessTokens(user: IUserModel) {
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    return jwt.signAccessToken(tokenPayload);
  }
  // #endregion
}

export default new AuthService();
