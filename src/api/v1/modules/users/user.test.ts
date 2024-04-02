/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import { beforeAll, describe, expect, test } from '@jest/globals';
import { removeCache } from '@src/configs/database/redis/cache';
import app from '../../../../configs/express/index';

const req = request(app);

async function createSeedUsers() {
  const user = {
    username: 'user',
    email: '',
    password: 'password',
    rePassword: 'password',
    first_name: 'first',
    last_name: 'last',
  };
  let i = 1;

  const users = Array.from({ length: 10 }).map(() => {
    user.username = `user${i}`;
    user.email = `${user.username}@local.com`;
    i += 1;
    return JSON.parse(JSON.stringify(user));
  });

  const promises = users.map((u) => req.post('/api/v1/auth/register').send(u));
  await Promise.all(promises);
}

beforeAll(async () => {
  // create some users
  await createSeedUsers();
});

describe('USER MODULE', () => {
  describe('Get users API', () => {
    test('should get all users', async () => {
      const url = '/api/v1/users';
      await removeCache(url);
      const res = await req.get(url);

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data[0]).toHaveProperty('id');
      expect(res.body.metadata).toHaveProperty('totalCount');
    });

    test('should get users with pagination', async () => {
      const query = {
        page: 1,
        limit: 5,
      };
      const url = `/api/v1/users?page=${query.page}&limit=${query.limit}`;
      await removeCache(url);
      const res = await req.get(url);

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
      expect(res.body.data.length).toEqual(query.limit);
      expect(res.body.metadata.page).toEqual(query.page);
      expect(res.body.metadata.limit).toEqual(query.limit);
    });

    test('should get users with filter', async () => {
      const query = {
        f_username: 'user1',
      };
      const url = `/api/v1/users?f_username=${query.f_username}`;
      await removeCache(url);
      const res = await req.get(url);

      expect(res.status).toEqual(200);
      expect(Array.isArray(res.body.data)).toBeTruthy();
    });
  });

  describe('Get user API', () => {
    test('should get user by id', async () => {
      const url = '/api/v1/users';
      await removeCache(url);
      const resUsers = await req.get(url);
      expect(resUsers.status).toEqual(200);

      const user = resUsers.body.data[0];
      const res = await req.get(`/api/v1/users/${user.id}`);

      expect(res.status).toEqual(200);
      expect(res.body.data.id).toEqual(user.id);
    });
  });
});
