import request from 'supertest';

import app from '../../../server/bin/app';
import { Account, Reminder } from '../../../server/_models';
import wipeModel from '../../_util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../_util/seedTestUsers';
import { reminderId1, seedTestReminders } from '../../_util/seedTestReminders';
import generateToken from '../../_util/generateToken';
import { getModelsArray, omitPropertiesFromBody } from '../../util/selectors';

const rootUrl = '/_api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';

const newReminderId = 'f5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

describe('/api/accounts/:account/reminders', () => {
  // Seed with some standard user data
  let token = null;
  beforeEach(async () => {
    await wipeTestUsers();
    await seedTestUsers();
    await Account.create({
      id: accountId2,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });
    await wipeModel(Reminder);
    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });
  /*
  beforeAll(async () => {
    console.log('wiping all models');
    await wipeTestUsers();
    console.log('wiped all models');

    console.log('seeding test users');
    await seedTestUsers();
    console.log('seeded test users');
    // Seed an extra account for fetching multiple and testing switching
    await Account.create({
      id: accountId2,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });
  */
  afterAll(async () => {
    // await wipeAllModels();
  });

  describe('Reminders', () => {
    beforeEach(async () => {
      await seedTestReminders();
    });

    describe('GET /:accountId/reminders', () => {
      test.only('should fetch all reminders for the account', () => {
        return request(app)
          .get(`${rootUrl}/${accountId}/reminders`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            console.log(JSON.stringify(body));
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
            primaryType: 'sms',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
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
            id: newReminderId,
            primaryType: 'phone',
            createdAt: '2017-07-19T00:14:30.932Z',
          })
          .expect(200)
          .then(({ body }) => {
            body = omitPropertiesFromBody(body);
            const reminders = getModelsArray('reminders', body);
            const [reminder] = reminders;
            expect(reminders.length).toBe(1);
            expect(reminder.primaryType).toBe('phone');
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
        // have to restore recalls cause these routes could delete
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
