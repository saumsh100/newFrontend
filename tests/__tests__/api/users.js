
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import {
  accountId,
  ownerUserId,
  managerUserId,
  seedTestUsers,
  wipeTestUsers,
} from '../../util/seedTestUsers';
import { omitProperties, omitPropertiesFromBody }  from '../../util/selectors';

const rootUrl = '/api/users';

describe('/api/users', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeTestUsers();
  });

  describe('GET /', () => {
    test('/me - retrieve user from token', () => {
      return request(app)
        .get(`${rootUrl}/me`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body.account = omitProperties(body.account);
          body.account.address = omitProperties(body.account.address);
          body.enterprise = omitProperties(body.enterprise);

          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:userId - retrieve user from id', () => {
      return request(app)
        .get(`${rootUrl}/${ownerUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    // TODO: Password diff each time, fix this
    test('/ - retrieve users', () => {
      return request(app)
        .get(`${rootUrl}/${ownerUserId}`)
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
        .put(`${rootUrl}/${managerUserId}`)
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

  describe('DELETE /:userId', () => {
    test('delete a user', async () => {
      token = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .delete(`${rootUrl}/${managerUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /:userId', () => {
    test('delete a user fail due to being a manager', async () => {
      token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .delete(`${rootUrl}/${managerUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
