import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, ModelStatic } from 'sequelize';
import { ACCOUNT_STATUS } from '@src/utils/constants/enum';
import bcrypt from 'bcryptjs';
import { db } from '../init.sequelize';

export interface IUserModel
  extends Model<InferAttributes<IUserModel, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<IUserModel>> {
  id: CreationOptional<string>;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  full_name?: string;

  email_verified?: CreationOptional<boolean>;
  country_code?: CreationOptional<string>;
  phone_number?: CreationOptional<string>;
  phone_number_verified?: CreationOptional<boolean>;
  otp?: CreationOptional<string>;
  otp_expires?: CreationOptional<Date | string>;
  forgot_password_code?: CreationOptional<string>;
  forgot_password_code_expires?: CreationOptional<Date | string>;
  reset_password?: CreationOptional<boolean>;
  enabled_2fa?: CreationOptional<boolean>;
  secret_2fa?: CreationOptional<string>;
  status?: CreationOptional<ACCOUNT_STATUS>;

  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt?: CreationOptional<Date>;
}

const UserModel = db.sequelize.define<IUserModel>(
  'Users',
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
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
      defaultValue: false,
    },
    enabled_2fa: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    secret_2fa: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(ACCOUNT_STATUS)),
      defaultValue: ACCOUNT_STATUS.INACTIVE,
    },

    full_name: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.first_name} ${this.last_name}`;
      },
    },
  },
  { paranoid: true, timestamps: true }
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

export default UserModel;
