/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, expect, test } from '@jest/globals';
import { db } from '@database';
import { i18nKey } from '@configs/i18n/init.i18n';
import { ACCOUNT_STATUS } from '@utilsV1/constants/enum';
import authService from './auth.service';

describe('AUTH MODULE', () => {
  describe('Register API', () => {
    const user = {
      username: 'test',
      email: 'test@local.com',
      password: 'test1234',
      rePassword: 'test1234',
      firstName: 'test',
      lastName: 'test',
    };

    test('should return JWT tokens upon successful registration', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const res = await authService.register(user, transaction);

        expect(res.tokens).toHaveProperty('accessToken');
        expect(res.tokens).toHaveProperty('refreshToken');
        expect(res.user).toHaveProperty('id');

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should return error with status code 400 for existed user', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        await authService.register(user, transaction);
        await authService.register(user, transaction);
        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual(i18nKey.auth.userExisted);
      }
    });
  });

  describe('Login API', () => {
    const user = {
      username: 'test',
      email: 'test@local.com',
      password: 'test1234',
      rePassword: 'test1234',
      firstName: 'test',
      lastName: 'test',
    };
    test('should return JWT tokens upon successful login by email', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dto = {
          email: user.email,
          password: user.password,
        };
        await authService.register(user, transaction);
        const res = await authService.login(dto, transaction);

        expect(res.user).toHaveProperty('id');
        expect(res.tokens).toHaveProperty('accessToken');
        expect(res.tokens).toHaveProperty('refreshToken');

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should return JWT tokens upon successful login by username', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dto = {
          username: user.username,
          password: user.password,
        };
        await authService.register(user, transaction);
        const res = await authService.login(dto, transaction);

        expect(res.user).toHaveProperty('id');
        expect(res.tokens).toHaveProperty('accessToken');
        expect(res.tokens).toHaveProperty('refreshToken');

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should return error for wrong password', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dto = {
          email: user.email,
          password: `wrong${user.password}`,
        };
        await authService.register(user, transaction);
        await authService.login(dto, transaction);

        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual(i18nKey.auth.wrongUsernameOrPassword);
      }
    });

    test('should return error for wrong email', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dto = {
          email: `wrong${user.email}`,
          password: user.password,
        };
        await authService.register(user, transaction);
        await authService.login(dto, transaction);

        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual(i18nKey.auth.wrongUsernameOrPassword);
      }
    });
  });

  describe('Forgot password API', () => {
    const user = {
      username: 'test',
      email: 'test@local.com',
      password: 'test1234',
      rePassword: 'test1234',
      firstName: 'test',
      lastName: 'test',
    };

    test('should send email with reset code when input email', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dto = { email: user.email };

        await authService.register(user, transaction);
        const res = await authService.forgotPassword(dto, transaction);

        expect(res.email).toEqual(dto.email);
        expect(res.otp).not.toBeNull();
        expect(res.expires).not.toBeNull();

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should send email with reset code when input username', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dto = { username: user.username };
        await authService.register(user, transaction);
        const res = await authService.forgotPassword(dto, transaction);

        expect(res.email).toEqual(user.email);
        expect(res.otp).not.toBeNull();
        expect(res.expires).not.toBeNull();

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should return error with status code 404 for not found username', async () => {
      try {
        const dto = { username: `wrong${user.username}` };
        await authService.forgotPassword(dto);
      } catch (error: any) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual(i18nKey.auth.userNotFound);
      }
    });

    test('should return error with status code 404 for not found email', async () => {
      try {
        const dto = { email: `wrong${user.email}` };
        await authService.forgotPassword(dto);
      } catch (error: any) {
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual(i18nKey.auth.userNotFound);
      }
    });
  });

  describe('Reset password API', () => {
    const user = {
      username: 'test',
      email: 'test@local.com',
      password: 'test1234',
      rePassword: 'test1234',
      firstName: 'test',
      lastName: 'test',
    };

    test('should reset password when input valid otp', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dtoForgot = { email: user.email };

        await authService.register(user, transaction);
        const forgotRes = await authService.forgotPassword(dtoForgot, transaction);

        const newPassword = 'new-password';
        const dtoReset = {
          otp: forgotRes.otp,
          email: user.email,
          newPassword,
          rePassword: newPassword,
        };
        const res = await authService.resetPassword(dtoReset, transaction);

        expect(res).toEqual(true);
        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should return error when input invalid otp', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const dtoForgot = { username: user.username };
        await authService.register(user, transaction);
        const forgotRes = await authService.forgotPassword(dtoForgot, transaction);

        const newPassword = 'new-password';
        const dtoReset = {
          otp: `wrong${forgotRes.otp}`,
          username: user.username,
          newPassword,
          rePassword: newPassword,
        };
        await authService.resetPassword(dtoReset, transaction);

        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        expect(error.statusCode).toEqual(400);
        expect(error.message).toEqual(i18nKey.auth.otpNotMatch);
      }
    });

    test('should return error with status code 404 for not found user', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const newPassword = 'new-password';
        const dto = {
          email: `wrong.${user.email}`,
          newPassword,
          rePassword: newPassword,
          otp: '122323',
        };
        await authService.resetPassword(dto, transaction);

        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        expect(error.statusCode).toEqual(404);
        expect(error.message).toEqual(i18nKey.auth.userNotFound);
      }
    });
  });

  describe('Refresh token API', () => {
    test('should refresh token', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const user = {
          username: 'test',
          email: 'test@local.com',
          password: 'test1234',
          rePassword: 'test1234',
          firstName: 'test',
          lastName: 'test',
        };

        const registerRes = await authService.register(user, transaction);
        const { id } = registerRes.user;

        const res = await authService.refreshAccessToken(id, transaction);
        expect(res.tokens.accessToken).not.toBeNull();

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  });

  describe('Verify email API', () => {
    const registerDto = {
      username: 'test-verify',
      email: 'test-verify@local.com',
      password: 'test1234',
      rePassword: 'test1234',
      firstName: 'test',
      lastName: 'test',
    };

    test('should verify email and active user', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const data = await authService.register(registerDto, transaction);
        const { otp } = await authService.generateOTP(data.user.id, transaction);
        const user = await authService.verifyEmail({ otp, email: data.user.email }, transaction);

        expect(user.status).toEqual(ACCOUNT_STATUS.ACTIVE);
        expect(user.emailVerified).toEqual(true);
        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should not verify email when input invalid otp', async () => {
      const transaction = await db.sequelize.transaction();
      try {
        const data = await authService.register(registerDto, transaction);
        const { otp } = await authService.generateOTP(data.user.id, transaction);
        await authService.verifyEmail({ otp: `fake-${otp}`, email: data.user.email }, transaction);

        await transaction.rollback();
      } catch (error: any) {
        await transaction.rollback();
        expect(error.message).toEqual(i18nKey.auth.otpNotMatch);
      }
    });
  });
});
