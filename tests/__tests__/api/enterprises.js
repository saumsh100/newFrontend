
import request from 'supertest';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Enterprise } from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, enterprise, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import { omitPropertiesFromBody } from '../../util/selectors';

const accountId2 = '1fa3a399-5a41-42d9-b2c8-59df666ec7ea';

const account2 = {
  id: accountId2,
  enterpriseId,
  name: 'Test Account 2',
  timezone: 'Africa/Bamako',
  createdAt: '2017-07-19T00:14:30.932Z',
};

describe('/api/enterprises', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    beforeEach(async () => {
      await seedTestUsers();
    });

    test('/ - get enterprises', () => {
      return request(app)
        .get('/api/enterprises/')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:enterpriseId - retrieve enterprise', () => {
      return request(app)
        .get(`/api/enterprises/${enterpriseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:enterpriseId/accounts - retrieve enterprise accounts', () => {
      return request(app)
        .get(`/api/enterprises/${enterpriseId}/accounts`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

  });

  describe('POST /', () => {
    beforeEach(async () => {
      await wipeModel(Enterprise);
    });

    test('/ - create an enterprise', () => {
      return request(app)
        .post('/api/enterprises')
        .set('Authorization', `Bearer ${token}`)
        .send(enterprise)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.enterprises).length).toBe(1);
        });
    });

    // TODO: Test enteprise switch
    /*
    test('/switch - switch enterprise', () => {

    });
    */

    test('/:enterpriseId/accounts - create account under enterprise', async () => {
      await seedTestUsers();
      return request(app)
        .post(`/api/enterprises/${enterpriseId}/accounts`)
        .set('Authorization', `Bearer ${token}`)
        .send(account2)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.accounts).length).toBe(1);
        });
    });

  });

  describe('PUT /', () => {
    beforeEach(async () => {
      await seedTestUsers();
    });

    test('/:enterpriseId/accounts/:accountId - update account', () => {
      return request(app)
        .put(`/api/enterprises/${enterpriseId}/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated',
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    beforeEach(async () => {
      await seedTestUsers();
    });

    test('/:enterpriseId/accounts/:accountId - delete enterprise account', () => {
      return request(app)
        .delete(`/api/enterprises/${enterpriseId}/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
