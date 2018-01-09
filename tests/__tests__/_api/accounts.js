
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  WeeklySchedule,
} from '../../../server/_models';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers, Correspondence } from '../../_util/seedTestUsers';
import generateToken from '../../_util/generateToken';
import { getModelsArray, omitPropertiesFromBody, omitProperties, omitPropertiesFromBodyJsonApi } from '../../util/selectors';
import wipeModel from '../../_util/wipeModel';

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const permissionId = '84d4e661-1155-4494-8fdb-c4ec0ddf804d';
const userId = '72954241-3652-4792-bae5-5bfed53d37b7';

async function seedData() {
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Account.create({
    id: accountId2,
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

describe('/api/accounts', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedData();
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeModel(WeeklySchedule);
    await wipeTestUsers();
  });

  describe('GET /', () => {
    test('with manager role so only return one', async () => {
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });

    test('with owner role so return all', async () => {
      // TODO: need to insert another account into enterprise to test that it returns multiple
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .get(rootUrl)
        .set('Authorization', `Bearer ${ownerToken}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('GET /configurations', () => {
    test('Getting Connector Configs', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .get(`${rootUrl}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['id'], true);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('GET /:accountId/configurations', () => {
    test('Getting Connector Configs', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .get(`${rootUrl}/${accountId}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['id'], true);
          expect(body).toMatchSnapshot();
        });
    });

    test('Getting Connector Configs - wrong id', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .get(`${rootUrl}/dsfhds;kjdfs}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(404)
        .then(({ body }) => {
        });
    });
  });

  describe('PUT /configurations', () => {
    afterAll(async () => {
      await wipeModel(Correspondence);
    });

    test('Changing Connector Configs', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .put(`${rootUrl}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .send({
          name: 'QUICK_SYNC_INTERVAL',
          value: 30,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['id'], true);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT /:accountId/configurations', () => {
    afterAll(async () => {
      await wipeModel(Correspondence);
    });

    test('Changing Connector Configs', async () => {
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .put(`${rootUrl}/${accountId}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .send({
          name: 'QUICK_SYNC_INTERVAL',
          value: 30,
        })
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body, ['id'], true);
          expect(body).toMatchSnapshot();
        });
    });

    test('Changing Connector Configs - Wrong Id', async () => {
      // TODO: need to insert another account into enterprise to test that it returns multiple
      const ownerToken = await generateToken({ username: 'owner@test.com', password: '!@CityOfBudaTest#$' });
      return request(app)
        .put(`${rootUrl}/dsfhds;kjdfs}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .send({
          name: 'QUICK_SYNC_INTERVAL',
          value: 30,
        })
        .expect(404)
        .then(({ body }) => {
        });
    });
  });

  describe('POST /:accountId/logo', () => {
    // TODO: test after... this is an easy route to change
  });

  describe('DELETE /:accountId/logo', () => {
    test('should return account with logo as null', async () => {
      return request(app)
        .delete(`${rootUrl}/${accountId}/logo`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const accounts = getModelsArray('accounts', body);
          const [account] = accounts;
          expect(accounts.length).toBe(1);
          expect(account.logo).toBe(null);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /:accountId/switch', () => {
    test('should return 403 for MANAGER role', async () => {
      return request(app)
        .post(`${rootUrl}/${accountId2}/switch`)
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });

    test('should return new token with the new accountId for SUPERADMIN role', async () => {
      const superAdminToken = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' })
      return request(app)
        .post(`${rootUrl}/${accountId2}/switch`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const { token } = body;
          expect(typeof token).toBe('string');
        });
    });
  });

  describe('GET /:accountId', () => {
    test('get the account data', () => {
      return request(app)
        .get(`${rootUrl}/${accountId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('POST /:accountId/newUser', () => {
    test('should create and return the user', async () => {
      const superAdminToken = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' })
      return request(app)
        .post(`${rootUrl}/${accountId}/newUser`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          id: userId,
          createdAt: '2017-07-20T00:14:30.932Z',
          role: 'MANAGER',
          email: 'newguy@test.com',
          password: '!@__NEWGUYISNEW__#$',
          firstName: 'New',
          lastName: 'Guy',
        })
        .expect(201)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const [user] = getModelsArray('users', body);
          delete user.password;
          delete user.permission;
          delete user.permissionId;
          expect(user).toMatchSnapshot();
        });
    });

    test('should fail for not having required field', async () => {
      const superAdminToken = await generateToken({ username: 'superadmin@test.com', password: '!@CityOfBudaTest#$' })
      return request(app)
        .post(`${rootUrl}/${accountId}/newUser`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          role: 'MANAGER',
          lastName: 'Guy',
        })
        .expect(500);
    });
  });

  describe('PUT /:accoutId', () => {
    test('should update the account', () => {
      const name = 'Test That Thang';
      return request(app)
        .put(`${rootUrl}/${accountId}`)
        .send({ name })
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const accounts = getModelsArray('accounts', body);
          const [account] = accounts;
          expect(account.name).toBe(name);
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('GET /:accountId/users', () => {
    test('should fetch users for the account', () => {
      return request(app)
        .get(`${rootUrl}/${accountId}/users`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .then(({ body }) => {
          body = omitPropertiesFromBody(body);
          const users = getModelsArray('users', body).map((u) => {
            delete u.password;
            return u;
          });

          expect(users.length).toBe(2);
          expect(body).toMatchSnapshot();
        });
    });
  });
});
