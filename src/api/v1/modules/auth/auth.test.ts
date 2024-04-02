/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { describe, expect, test } from '@jest/globals';
import app from '../../../../configs/express/index';

const req = request(app);

describe('AUTH MODULE', () => {
  describe('Register API', () => {
    const user = {
      username: 'test',
      email: 'test@local.com',
      password: 'test1234',
      rePassword: 'test1234',
      first_name: 'test',
      last_name: 'test',
    };

    test('should return JWT tokens upon successful registration', async () => {
      const res = await req.post('/api/v1/auth/register').send(user);

      expect(res.status).toEqual(201);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data.user).toHaveProperty('id');
    });

    test('should return error with status code 400 for existed user', async () => {
      const res = await req.post('/api/v1/auth/register').send(user);

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual('Email or username has already been used.');
    });

    test('should return error with status code 400 for invalid payload', async () => {
      user.email = 'test1@.com';
      const res = await req.post('/api/v1/auth/register').send(user);

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual('"email" must be a valid email');
    });
  });

  describe('Login API', () => {
    test('should return JWT tokens upon successful login by email', async () => {
      const dto = {
        email: 'test@local.com',
        password: 'test1234',
      };
      const res = await req.post('/api/v1/auth/login').send(dto);

      expect(res.status).toEqual(200);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data.user).toHaveProperty('id');
    });

    test('should return JWT tokens upon successful login by username', async () => {
      const dto = {
        username: 'test',
        password: 'test1234',
      };
      const res = await req.post('/api/v1/auth/login').send(dto);

      expect(res.status).toEqual(200);
      expect(res.body.data.tokens).toHaveProperty('accessToken');
      expect(res.body.data.tokens).toHaveProperty('refreshToken');
      expect(res.body.data.user).toHaveProperty('id');
    });

    test('should return error with status code 400 for wrong password or email', async () => {
      const dto = {
        email: 'test@local.com',
        password: 'wrong-password',
      };
      const res = await req.post('/api/v1/auth/login').send(dto);

      expect(res.status).toEqual(400);
    });

    test('should return error with status code 400 for invalid email, username or password', async () => {
      const dto = {
        email: 'test',
        password: 'wrong-password',
      };
      const res = await req.post('/api/v1/auth/login').send(dto);
      expect(res.status).toEqual(400);
    });
  });

  describe('Forgot password API', () => {
    test('should send email with reset code when input email', async () => {
      const dto = {
        email: 'test@local.com',
      };
      const res = await req.post('/api/v1/auth/forgot-password').send(dto);

      expect(res.status).toEqual(200);
    });

    test('should send email with reset code when input username', async () => {
      const dto = {
        username: 'test',
      };
      const res = await req.post('/api/v1/auth/forgot-password').send(dto);

      expect(res.status).toEqual(200);
    });

    test('should return error with status code 404 for not found user', async () => {
      const dto = {
        username: 'test-not-exist',
      };
      const res = await req.post('/api/v1/auth/forgot-password').send(dto);

      expect(res.status).toEqual(404);
    });
  });

  describe('Reset password API', () => {
    test('should reset password when input valid otp', async () => {
      const dtoForgot = {
        email: 'test@local.com',
      };
      const forgotRes = await req.post('/api/v1/auth/forgot-password').send(dtoForgot);
      const { otp } = forgotRes.body.data;
      const dtoReset = {
        otp,
        email: 'test@local.com',
        newPassword: 'new-password',
        rePassword: 'new-password',
      };
      const res = await req.post('/api/v1/auth/reset-password').send(dtoReset);

      expect(res.status).toEqual(200);
    });

    test('should return error when input invalid otp', async () => {
      const dtoForgot = {
        username: 'test',
      };
      await req.post('/api/v1/auth/forgot-password').send(dtoForgot);
      const dtoReset = {
        otp: '111111',
        username: 'test',
        newPassword: 'new-password',
        rePassword: 'new-password',
      };
      const res = await req.post('/api/v1/auth/reset-password').send(dtoReset);

      expect(res.status).toEqual(400);
      expect(res.body.message).toEqual('Invalid OTP code');
    });

    test('should return error with status code 404 for not found user', async () => {
      const dto = {
        email: 'test-not-exist@local.com',
        newPassword: 'new-password',
        rePassword: 'new-password',
        otp: '122323',
      };
      const res = await req.post('/api/v1/auth/reset-password').send(dto);

      expect(res.status).toEqual(404);
    });
  });

  describe('Refresh token API', () => {
    test('should refresh token', async () => {
      const registerDto = {
        username: 'test-refresh',
        email: 'test-refresh@local.com',
        password: 'test1234',
        rePassword: 'test1234',
        first_name: 'test',
        last_name: 'test',
      };

      const registerRes = await req.post('/api/v1/auth/register').send(registerDto);
      expect(registerRes.status).toEqual(201);
      const { refreshToken } = registerRes.body.data.tokens;

      const dto = { refreshToken };
      const res = await req.post('/api/v1/auth/refresh-access-token').send(dto);

      expect(res.status).toEqual(200);
      expect(typeof res.body.data).toEqual('string');
    });
  });
});
