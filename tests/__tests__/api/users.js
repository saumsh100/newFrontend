
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import {
  accountId,
  ownerUserId,
  managerUserId,
  seedTestUsers,
} from '../../util/seedTestUsers';
import { omitPropertiesFromBody }  from '../../util/selectors';

describe('/api/users', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  describe('GET /', () => {
    test('/me - retrieve user from token', () => {
      return request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:userId - retrieve user from id', () => {
      return request(app)
        .get(`/api/users/${ownerUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: Password diff each time, fix this
    test('/ - retrieve users', () => {
      return request(app)
        .get(`/api/users/${ownerUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountId,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });
  });


  describe('PUT /:userId', () => {
    test('update a user', async () => {
      return request(app)
        .put(`/api/users/${managerUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          oldPassword: '!@CityOfBudaTest#$',
          password: 'jankpass',
          confirmPassword: 'jankpass',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['password']);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
