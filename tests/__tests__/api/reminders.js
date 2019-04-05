
import request from 'supertest';
import app from '../../../server/bin/app';
import { Account, Reminder, Address } from '../../../server/_models';
import wipeModel from '../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../util/seedTestUsers';
import { reminderId1, seedTestReminders } from '../../util/seedTestReminders';
import generateToken from '../../util/generateToken';
import { getModelsArray, omitProperties, omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const addressId = 'd94894b1-84ec-492c-a33e-3f1ad61b9c1c';
const newReminderId = 'f5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

const address = {
  id: addressId,
  country: 'CA',
  createdAt: '2017-07-19T00:14:30.932Z',
  updatedAt: '2017-07-19T00:14:30.932Z',
};

describe('/api/accounts/:account/reminders', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeModel(Reminder);
    await wipeTestUsers();
    await seedTestUsers();
    await Address.create(address);
    await Account.create({
      id: accountId2,
      addressId,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  describe('Reminders', () => {
    beforeEach(async () => {
      await seedTestReminders();
    });

    afterAll(async () => {
      await wipeModel(Reminder);
      await wipeTestUsers();
    });

    describe('GET /:accountId/reminders', () => {
      test('should fetch all reminders for the account', () => {
        return request(app)
          .get(`${rootUrl}/${accountId}/reminders`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            body = omitProperties(body, ['result']);
            const reminders = getModelsArray('reminders', body);
            expect(reminders.length).toBe(2);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .get(`${rootUrl}/${accountId2}/reminders`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('POST /:accountId/reminders', () => {
      test('should create a reminders for the account', () => {
        return request(app)
          .post(`${rootUrl}/${accountId}/reminders`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: newReminderId,
            primaryTypes: ['sms'],
            interval: '2 hours',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(201)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const reminders = getModelsArray('reminders', body);
            expect(reminders.length).toBe(1);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .post(`${rootUrl}/${accountId2}/reminders`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('PUT /:accountId/reminders/:reminderId', () => {
      test('should update a reminder for the account', () => {
        return request(app)
          .put(`${rootUrl}/${accountId}/reminders/${reminderId1}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            id: reminderId1,
            primaryTypes: ['phone'],
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const reminders = getModelsArray('reminders', body);
            const [reminder] = reminders;
            expect(reminders.length).toBe(1);
            expect(reminder.primaryTypes).toEqual(['phone']);
            expect(body).toMatchSnapshot();
          });
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .put(`${rootUrl}/${accountId2}/reminders/${reminderId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });

    describe('DELETE /:accountId/reminders/:reminderId', () => {
      afterEach(async () => {
        await seedTestReminders();
      });

      test('should delete a reminder for the account', () => {
        return request(app)
          .delete(`${rootUrl}/${accountId}/reminders/${reminderId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204);
      });

      test('should return 403 for different accountIds', () => {
        return request(app)
          .delete(`${rootUrl}/${accountId2}/reminders/${reminderId1}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(403);
      });
    });
  });

});
