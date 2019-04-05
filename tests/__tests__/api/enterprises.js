
import request from 'supertest';
import jwt from 'jwt-decode';
import app from '../../../server/bin/app';
import generateToken from '../../util/generateToken';
import { Account, Enterprise, Address } from '../../../server/_models';
import { wipeAllModels } from '../../util/wipeModel';
import { accountId, enterprise, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import { omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/api/enterprises';

const addressId = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';

const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

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
  beforeEach(async () => {
    await seedTestUsers();
    token = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('GET /', () => {
    test('/ - get enterprises', () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:enterpriseId - retrieve enterprise', () => {
      return request(app)
        .get(`${rootUrl}/${enterpriseId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('/:enterpriseId/accounts - retrieve enterprise accounts', () => {
      return request(app)
        .get(`${rootUrl}/${enterpriseId}/accounts`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

  });

  describe('POST /', () => {
    test('/ - create an enterprise', () => {
      return request(app)
        .post(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .send(enterprise)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(Object.keys(body.entities.enterprises).length).toBe(1);
        });
    });

    test('/switch - switch enterprise', async () => {
      // Seed another enterprise and account
      const enterprise = await Enterprise.create({ name: 'Testerprise' });
      await Address.create(address);
      const account = await Account.create({
        enterpriseId: enterprise.id,
        addressId,
        name: 'Testcount',
      });

      return request(app)
        .post(`${rootUrl}/switch`)
        .set('Authorization', `Bearer ${token}`)
        .send({ enterpriseId: enterprise.id })
        .expect(200)
        .then(({ body: { token: newToken } }) => {
          expect(typeof newToken).toBe('string');

          const tokenData = jwt(newToken);
          expect(tokenData.activeAccountId).toBe(account.id);
        });
    });

    test('/:enterpriseId/accounts - create account under enterprise', async () => {
      return request(app)
        .post(`${rootUrl}/${enterpriseId}/accounts`)
        .set('Authorization', `Bearer ${token}`)
        .send(account2)
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['weeklyScheduleId', 'addressId']);
          expect(Object.keys(body.entities.accounts).length).toBe(1);
          expect(body).toMatchSnapshot();
        });
    });

  });

  describe('PUT /', () => {
    test('/:enterpriseId/accounts/:accountId - update account', () => {
      return request(app)
        .put(`${rootUrl}/${enterpriseId}/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated' })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('DELETE /', () => {
    test('/:enterpriseId/accounts/:accountId - delete enterprise account', () => {
      return request(app)
        .delete(`${rootUrl}/${enterpriseId}/accounts/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
