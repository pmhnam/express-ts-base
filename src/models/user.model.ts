/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { ACCOUNT_STATUS } from '@utils/constants/enum';
import bcrypt from 'bcryptjs';
import { db } from '@db';
import { IRoleModel } from '@models/role.model';

export interface IUserModel
  extends Model<InferAttributes<IUserModel, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<IUserModel>> {
  id: CreationOptional<string>;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: CreationOptional<string>;
  roleId: string;
  fullName?: string;

  picture?: CreationOptional<string>;

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

  role?: NonAttribute<IRoleModel>;
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
    picture: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
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
    updatedBy: {
      type: DataTypes.UUID,
    },
    deletedBy: {
      type: DataTypes.UUID,
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

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Hash password
UserModel.beforeCreate(async (user) => {
  if (user.password) user.password = await hashPassword(user.password);
});
UserModel.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await hashPassword(user.password);
  }
});
UserModel.beforeBulkUpdate(async (opt: any) => {
  opt.attributes = opt.attributes || {};
  if (opt.attributes?.password) {
    opt.attributes.password = await hashPassword(opt.attributes.password);
  }
});
UserModel.beforeDestroy(async (user) => {
  user.email = `deleted_${user.email}`;
  user.username = `deleted_${user.username}`;
});
UserModel.beforeBulkDestroy(async (opt) => {
  opt.individualHooks = true;
});
