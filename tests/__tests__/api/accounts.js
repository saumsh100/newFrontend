
import request from 'supertest';
import {
  Account,
  Address,
  WeeklySchedule,
} from 'CareCruModels';
import app from '../../../server/bin/app';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers, Correspondence } from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import { getModelsArray, omitPropertiesFromBody } from '../../util/selectors';
import wipeModel from '../../util/wipeModel';
import { seedTestOfficeHour, wipeTestOfficeHour, officeHourId } from '../../util/seedTestWeeklySchedules';
import filterObject from './chats';

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const userId = '72954241-3652-4792-bae5-5bfed53d37b7';
const addressId = '62954241-3652-4792-bae5-5bfed53d37b7';
const createdAt = '2017-07-19T00:14:30.932Z';
const newOfficeHourId = '99954241-3652-4792-bae5-5bfed53d37b7';
const newMondayScheduleId = '88954241-3652-4792-bae5-5bfed53d37b7';

const address = {
  id: addressId,
  country: 'CA',
  createdAt,
  updatedAt: '2017-07-19T00:14:30.932Z',
};

const officeHourRequestBody = {
  createdAt,
  monday: {
    createdAt,
    startTime: '1970-01-31T16:00:00.000Z',
    endTime: '1970-02-01T01:00:00.000Z',
    date: '2018-08-02',
    breaks: [
      {
        startTime: '1970-01-31T20:00:00.000Z',
        endTime: '1970-01-31T21:00:00.000Z',
      },
      {
        startTime: '1970-01-31T23:00:00.000Z',
        endTime: '1970-02-01T00:00:00.000Z',
      },
    ],
  },
};

async function seedData() {
  await seedTestUsers();

  // Seed an extra account for fetching multiple and testing switching
  await Address.create(address);
  await Account.create({
    id: accountId2,
    addressId: '62954241-3652-4792-bae5-5bfed53d37b7',
    enterpriseId,
    name: 'Test Account 2',
    createdAt: '2017-07-20T00:14:30.932Z',
  });
}

async function associateAccountWithOfficeHour() {
  await Account.update(
    { weeklyScheduleId: officeHourId },
    { where: { id: accountId } },
  );
}

async function unassociateAccountWithOfficeHour() {
  await Account.update(
    { weeklyScheduleId: null },
    { where: { id: accountId } },
  );
}

describe('/api/accounts', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await seedData();
    await seedTestOfficeHour();
    token = await generateToken({
      username: 'manager@test.com',
      password: '!@CityOfBudaTest#$',
    });
  });

  afterAll(async () => {
    await wipeTestOfficeHour();
    await wipeModel(WeeklySchedule);
    await wipeTestUsers();
  });

  describe('GET /', () => {
    test('with manager role so only return one', async () => request(app)
      .get(rootUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        expect(body).toMatchSnapshot();
      }));

    test('with owner role so return all', async () => {
      // TODO: need to insert another account into enterprise to test that it returns multiple
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
      const wrongId = 'dsfhds;kjdfs}';
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
      return request(app)
        .get(`${rootUrl}/${wrongId}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .expect(500);
    });
  });

  describe('PUT /configurations', () => {
    afterAll(async () => {
      await wipeModel(Correspondence);
    });

    test('Changing Connector Configs', async () => {
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
      const wrongId = 'dsfhds;kjdfs}';
      const ownerToken = await generateToken({
        username: 'owner@test.com',
        password: '!@CityOfBudaTest#$',
      });
      return request(app)
        .put(`${rootUrl}/${wrongId}/configurations`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .set('Accept', 'application/vnd.api+json')
        .send({
          name: 'QUICK_SYNC_INTERVAL',
          value: 30,
        })
        .expect(500);
    });
  });

  describe('POST /:accountId/logo', () => {
    // TODO: test after... this is an easy route to change
  });

  describe('DELETE /:accountId/logo', () => {
    test('should return account with logo as null', async () => request(app)
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
      }));
  });

  describe('POST /:accountId/switch', () => {
    test('should return 403 for MANAGER role', async () => request(app)
      .post(`${rootUrl}/${accountId2}/switch`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403));

    test('should return new token with the new accountId for SUPERADMIN role', async () => {
      const superAdminToken = await generateToken({
        username: 'superadmin@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
    test('get the account data', () => request(app)
      .get(`${rootUrl}/${accountId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        expect(body).toMatchSnapshot();
      }));
  });

  describe('POST /:accountId/newUser', () => {
    test('should create and return the user', async () => {
      const superAdminToken = await generateToken({
        username: 'superadmin@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
      const superAdminToken = await generateToken({
        username: 'superadmin@test.com',
        password: '!@CityOfBudaTest#$',
      });
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
    test('should fetch users for the account', () => request(app)
      .get(`${rootUrl}/${accountId}/users`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(({ body }) => {
        body = omitPropertiesFromBody(body);
        const users = getModelsArray('users', body).map((u) => {
          delete u.password;
          return u;
        });

        getModelsArray('accounts', body).forEach((a) => {
          delete a.address.updatedAt;
        });

        expect(users.length).toBe(2);
        expect(body).toMatchSnapshot();
      }));
  });

  describe('GET /:accountId/OfficeHour', () => {
    test('when office hour does not exist', async () => request(app)
      .get(`${rootUrl}/${accountId}/officeHour`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404));

    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      const { body } = await request(app)
        .get(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      filterObject(body, 'updatedAt');
      expect(omitPropertiesFromBody(body)).toMatchSnapshot();
      await unassociateAccountWithOfficeHour();
    });
  });

  describe('DELETE /:accountId/OfficeHour', () => {
    test('when office hour does not exist', async () => request(app)
      .delete(`${rootUrl}/${accountId}/officeHour`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404));

    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      const { body } = await request(app)
        .get(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await unassociateAccountWithOfficeHour();
    });
  });

  describe('POST /:accountId/OfficeHour', () => {
    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      request(app)
        .post(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
      await unassociateAccountWithOfficeHour();
    });

    test('when office hour does not exist', async () => {
      // Manually set the id so that it always matches the snapshot
      officeHourRequestBody.id = newOfficeHourId;
      officeHourRequestBody.monday.id = newMondayScheduleId;
      const { body } = await request(app)
        .post(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .send(officeHourRequestBody)
        .expect(200);
      filterObject(body, 'updatedAt');
      expect(body).toMatchSnapshot();
    });
  });

  describe('PUT /:accountId/OfficeHour', () => {
    test('when office hour does not exist', async () => {
      request(app)
        .put(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      const { body } = await request(app)
        .put(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .send(officeHourRequestBody)
        .expect(200);

      filterObject(body, 'updatedAt');
      expect(omitPropertiesFromBody(body)).toMatchSnapshot();
      await unassociateAccountWithOfficeHour();
    });
  });

  describe('GET /:accountId/OfficeHour', () => {
    test('when office hour does not exist', async () => request(app)
      .get(`${rootUrl}/${accountId}/officeHour`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404));

    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      const { body } = await request(app)
        .get(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      filterObject(body, 'updatedAt');
      expect(omitPropertiesFromBody(body)).toMatchSnapshot();
      await unassociateAccountWithOfficeHour();
    });
  });

  describe('DELETE /:accountId/OfficeHour', () => {
    test('when office hour does not exist', async () => request(app)
      .delete(`${rootUrl}/${accountId}/officeHour`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404));

    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      const { body } = await request(app)
        .get(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      await unassociateAccountWithOfficeHour();
    });
  });

  describe('POST /:accountId/OfficeHour', () => {
    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      request(app)
        .post(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(409);
      await unassociateAccountWithOfficeHour();
    });

    test('when office hour does not exist', async () => {
      // Manually set the id so that it always matches the snapshot
      officeHourRequestBody.id = newOfficeHourId;
      officeHourRequestBody.monday.id = newMondayScheduleId;
      const { body } = await request(app)
        .post(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .send(officeHourRequestBody)
        .expect(200);
      filterObject(body, 'updatedAt');
      expect(body).toMatchSnapshot();
    });
  });

  describe('PUT /:accountId/OfficeHour', () => {
    test('when office hour does not exist', async () => {
      request(app)
        .put(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });

    test('when office hour exists', async () => {
      await associateAccountWithOfficeHour();
      const { body } = await request(app)
        .put(`${rootUrl}/${accountId}/officeHour`)
        .set('Authorization', `Bearer ${token}`)
        .send(officeHourRequestBody)
        .expect(200);

      filterObject(body, 'updatedAt');
      expect(omitPropertiesFromBody(body)).toMatchSnapshot();
      await unassociateAccountWithOfficeHour();
    });
  });
});
