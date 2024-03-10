import { DataTypes, Model, ModelStatic } from 'sequelize';
import { ACCOUNT_STATUS } from '@src/utils/constants/enum';
import { db } from '../index';

export interface IAccount extends Model {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  country_code: string;
  phone_number: string;
  phone_number_verified: boolean;
  password: string;
  otp?: string;
  otp_expires?: Date | string;
  forgot_password_code: string;
  forgot_password_code_expires?: Date | string;
  reset_password: boolean;
  enabled_2fa: boolean;
  secret_2fa?: string;
  status: ACCOUNT_STATUS;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccountModel = db.sequelize?.define<IAccount>(
  'Accounts',
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    country_code: {
      type: DataTypes.STRING,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    phone_number_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otp_expires: {
      type: DataTypes.DATE,
    },
    forgot_password_code: {
      type: DataTypes.STRING,
    },
    forgot_password_code_expires: {
      type: DataTypes.DATE,
    },
    reset_password: {
      type: DataTypes.BOOLEAN,
    },
    enabled_2fa: {
      type: DataTypes.BOOLEAN,
    },
    secret_2fa: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ACCOUNT_STATUS)),
    },
  },
  { paranoid: true, timestamps: true }
) as ModelStatic<IAccount>;

export default AccountModel;
