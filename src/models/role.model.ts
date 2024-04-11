import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { db } from '@db';

export interface IRoleModel
  extends Model<InferAttributes<IRoleModel, { omit: 'createdAt' | 'updatedAt' }>, InferCreationAttributes<IRoleModel>> {
  id: CreationOptional<string>;
  code: string;
  name: string;
  description?: string;

  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt?: CreationOptional<Date>;
}

export const RoleModel = db.sequelize.define<IRoleModel>(
  'roles',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    paranoid: true,
    timestamps: true,
    indexes: [
      { unique: true, fields: ['id'] },
      { unique: true, fields: ['code'] },
      { unique: true, fields: ['name'] },
    ],
  }
);
