
import bcrypt from 'bcrypt';
import request from 'supertest';
import { passwordHashSaltRounds } from '../../../server/config/globals';
import app from '../../../server/bin/app';
import { Account, Enterprise, Permission, User } from '../../../server/models';
import wipeModel from '../../util/wipeModel';
import seedTestUsers from '../../util/seedTestUsers';
import generateToken from './util/generateToken';

describe('/api/accounts', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  test('GET / - with manager role so only return one', async () => {
    return request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchSnapshot();
      });
  });

  test('GET / - with owner role so return all', async () => {
    const ownerToken = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' })
    return request(app)
      .get('/api/accounts')
      .set('Authorization', `Bearer ${ownerToken}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchSnapshot();
      });
  });
});
