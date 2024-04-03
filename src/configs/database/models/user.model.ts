import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { ACCOUNT_STATUS } from '@src/utils/constants/enum';
import bcrypt from 'bcryptjs';
import { db } from '../index';

export interface IUserModel
  extends Model<InferAttributes<IUserModel, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<IUserModel>> {
  id: CreationOptional<string>;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  fullName?: string;

  emailVerified?: CreationOptional<boolean>;
  countryCode?: CreationOptional<string>;
  phoneNumber?: CreationOptional<string>;
  phoneNumberVerified?: CreationOptional<boolean>;
  otp?: CreationOptional<string>;
  otpExpires?: CreationOptional<Date | string>;
  forgotPasswordCode?: CreationOptional<string>;
  forgotPasswordCodeExpires?: CreationOptional<Date | string>;
  resetPassword?: CreationOptional<boolean>;
  enabled2fa?: CreationOptional<boolean>;
  secret2fa?: CreationOptional<string>;
  status?: CreationOptional<ACCOUNT_STATUS>;

  updatedBy?: string;
  deletedBy?: string;

  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt?: CreationOptional<Date>;
}

export const UserModel = db.sequelize.define<IUserModel>(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    countryCode: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    phoneNumberVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otpExpires: {
      type: DataTypes.DATE,
    },
    forgotPasswordCode: {
      type: DataTypes.STRING,
    },
    forgotPasswordCodeExpires: {
      type: DataTypes.DATE,
    },
    resetPassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    enabled2fa: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    secret2fa: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ACCOUNT_STATUS)),
      defaultValue: ACCOUNT_STATUS.INACTIVE,
    },

    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  },
  {
    paranoid: true,
    timestamps: true,
    indexes: [
      { unique: true, fields: ['id'] },
      { unique: true, fields: ['email'] },
      { unique: true, fields: ['username'] },
    ],
  }
);

const hashPassword = async (user: IUserModel) => {
  if (user.password) {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(user.password, saltRounds);
    // eslint-disable-next-line no-param-reassign
    user.password = hashPassword;
  }
};

// Hash password
UserModel.beforeCreate(hashPassword);
UserModel.beforeUpdate(hashPassword);
