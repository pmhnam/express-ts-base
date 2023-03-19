/* eslint-disable func-names */
import mongoose, { Schema, Document } from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  deletedBy?: string;
}

export const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    status: String,
    deletedAt: Date,
    deletedBy: String,
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const saltRounds = Number(process.env.SALT_ROUND) || 10;
    // Hashing password...
    const hashPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashPassword;
    return next();
  } catch (error: any) {
    return next(error);
  }
});

export const UserModel = mongoose.model<IUser & Document>('User', UserSchema);
