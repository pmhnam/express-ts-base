/* eslint-disable import/no-extraneous-dependencies */
import { describe, expect, test } from '@jest/globals';
import { Transaction } from 'sequelize';
import sequelize from '@db/sequelize';
import authService from '@modules/v1/auth/auth.service';
import { ACCOUNT_STATUS } from '@utils/constants/enum';
import userService from './user.service';

async function createSeedUsers(transaction: Transaction, length = 10) {
  const users = Array.from({ length }).map((_, index) => {
    return {
      username: `seed-user${index}`,
      email: `seed-user${index}@local.com`,
      password: 'password',
      rePassword: 'password',
      firstName: 'first',
      lastName: 'last',
    };
  });

  const promises = users.map((u) => authService.register(u, transaction));
  return await Promise.all(promises);
}

describe('USER MODULE', () => {
  describe('GET /api/v1/users', () => {
    test('should get all users', async () => {
      const transaction = await sequelize.transaction();
      try {
        await createSeedUsers(transaction);
        const query = { page: '1', limit: '10' };
        const res = await userService.getUsers(query, transaction);

        expect(Array.isArray(res.users)).toBeTruthy();
        expect(res.metadata).toHaveProperty('totalCount');
        expect(res.metadata.totalCount).toBeGreaterThanOrEqual(1);
        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });

    test('should get users with filter', async () => {
      const transaction = await sequelize.transaction();
      try {
        const query = {
          f_username: 'seed-user1',
        };
        await createSeedUsers(transaction);
        const res = await userService.getUsers(query, transaction);

        expect(Array.isArray(res.users)).toBeTruthy();
        expect(res.metadata).toHaveProperty('totalCount');
        expect(res.metadata.totalCount).toBeGreaterThanOrEqual(1);
        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  });

  describe('GET /api/v1/users/:id', () => {
    test('should return user', async () => {
      const transaction = await sequelize.transaction();
      try {
        const result = await createSeedUsers(transaction);
        const { user } = result[0];

        const res = await userService.getUserById(user.id, transaction);

        expect(res.id).toEqual(user.id);

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    test('should update user', async () => {
      const transaction = await sequelize.transaction();
      try {
        const result = await createSeedUsers(transaction);

        const { user } = result[0];
        const dto = {
          username: 'test-update',
          email: 'test-update@local.com',
          password: 'test1234',
          firstName: 'test update',
          lastName: 'test update',
          status: ACCOUNT_STATUS.ACTIVE,
          updatedBy: user.id,
        };

        const res = await userService.updateUserById(user.id, dto, transaction);
        expect(res.id).toEqual(user.id);
        expect(res.username).toEqual(dto.username);
        expect(res.email).toEqual(dto.email);

        await transaction.rollback();
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    test('should delete user by id', async () => {
      const userDto = {
        username: 'test-delete',
        email: 'test-delete@local.com',
        password: 'test1234',
        rePassword: 'test1234',
        firstName: 'test delete',
        lastName: 'test delete',
      };
      const { user } = await authService.register(userDto);

      // hard delete
      const res = await userService.deleteUserById(user.id, user.id, true);
      expect(res).toBe(true);
    });
  });

  describe('DELETE /api/v1/users', () => {
    test('should delete users by ids', async () => {
      const transaction = await sequelize.transaction();

      const result = await createSeedUsers(transaction, 5);
      const userIds = result.map((u) => u.user.id);
      await transaction.commit();

      // hard delete
      const res = await userService.deleteUsersByIds(userIds, 'tester', true);
      expect(res).toBe(true);
    });
  });
});
