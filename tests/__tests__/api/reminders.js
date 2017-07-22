
import request from 'supertest';
import app from '../../../server/bin/app';
import {
  Account,
  Reminder,
} from '../../../server/models';
import wipeModel, { wipeAllModels } from '../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers } from '../../util/seedTestUsers';
import generateToken from '../../util/generateToken';
import { getModelsArray } from '../../util/selectors';

const rootUrl = '/api/accounts';
const accountId2 = '52954241-3652-4792-bae5-5bfed53d37b7';
const reminderId1 = 'd5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const reminderId2 = 'e5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';
const newReminderId = 'f5ab9bc0-f0e6-4538-99ae-2fe7f920abf4';

async function seedReminders() {
  await wipeModel(Reminder);

  // seed reminders
  await Reminder.save([
    {
      id: reminderId1,
      accountId,
      primaryType: 'sms',
      createdAt: '2017-07-19T00:14:30.932Z',
    },
    {
      id: reminderId2,
      accountId,
      primaryType: 'sms',
      createdAt: '2017-07-19T00:14:30.932Z',
    },
  ]);
}

describe('/api/accounts/:account/reminders', () => {
  // Seed with some standard user data
  let token = null;
  beforeAll(async () => {
    await seedTestUsers();

    // Seed an extra account for fetching multiple and testing switching
    await Account.save({
      id: accountId2,
      enterpriseId,
      name: 'Test Account 2',
      createdAt: '2017-07-20T00:14:30.932Z',
    });

    token = await generateToken({ username: 'manager@test.com', password: '!@CityOfBudaTest#$' });
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Reminders', () => {
    beforeAll(async () => {
      await seedReminders();
    });

    describe('GET /:accountId/reminders', () => {
      test('should fetch all reminders for the account', () => {
        return request(app)
          .get(`${rootUrl}/${accountId}/reminders`)
          .set('Authorization', `Bearer ${token}`)
          .expect(200)
          .then(({ body }) => {
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
        await seedReminders();
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
